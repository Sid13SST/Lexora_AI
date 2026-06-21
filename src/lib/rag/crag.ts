async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("OpenRouter API Error in CRAG helper:", errorData);
    throw new Error(`LLM call failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Checks if the user query has typos or errors. If so, corrects them.
 */
export async function correctQuery(query: string): Promise<string> {
  const systemPrompt = `You are a spelling and grammar correction assistant. 
Analyze the user's search query. If the query contains spelling mistakes, grammatical errors, or typos, rewrite it to be clean, correct, and professional while strictly preserving the original intent. 
If the query is already correct, return it exactly as it is.
CRITICAL: Output ONLY the corrected/original query text. Do not include any explanations, introduction, markdown quotes, or notes.`;

  try {
    const result = await callLLM(systemPrompt, query);
    console.log(`>>> [CRAG] Original Query: "${query}" -> Corrected: "${result}"`);
    return result || query;
  } catch (error) {
    console.error("Failed to correct query, returning original:", error);
    return query;
  }
}

/**
 * Evaluates whether a retrieved chunk is relevant to the query.
 * Returns true if relevant, false otherwise.
 */
export async function checkRelevance(query: string, chunk: string): Promise<boolean> {
  const systemPrompt = `You are a document relevance evaluator.
Assess whether the provided document chunk contains information relevant to answering the user's query.
Respond with exactly "yes" if the chunk is relevant, or exactly "no" if it is not relevant.
Do not include any explanation or other text.`;

  const userPrompt = `Query: ${query}\n\nDocument Chunk: ${chunk}`;

  try {
    const result = await callLLM(systemPrompt, userPrompt);
    const isRelevant = result.toLowerCase().includes("yes");
    console.log(`>>> [CRAG] Relevance check result: ${isRelevant ? "RELEVANT" : "IRRELEVANT"}`);
    return isRelevant;
  } catch (error) {
    console.error("Failed to check relevance, defaulting to true:", error);
    return true; // default to true on error to avoid discarding potentially useful info
  }
}

/**
 * Rewrites the search query to improve retrieval, using existing relevant and irrelevant info.
 */
export async function rewriteQuery(
  originalQuery: string,
  relevantChunks: string[],
  irrelevantChunks: string[]
): Promise<string> {
  const systemPrompt = `You are a search query optimizer.
Your job is to rewrite the search query to retrieve better documents from a vector database.
We previously retrieved some documents, but some were irrelevant.
Use the relevant information to sharpen the search, and use the irrelevant information to guide what we should avoid or refine.
Produce a rewritten query that is precise, descriptive, and optimal for semantic search.
CRITICAL: Output ONLY the rewritten query text. Do not include any explanations, formatting, or notes.`;

  const userPrompt = `Original Query: ${originalQuery}
Relevant Chunks found so far:
${relevantChunks.length > 0 ? relevantChunks.map((c, i) => `[Relevant ${i+1}]: ${c.substring(0, 200)}...`).join("\n") : "None"}

Irrelevant Chunks we want to avoid or refine:
${irrelevantChunks.length > 0 ? irrelevantChunks.map((c, i) => `[Irrelevant ${i+1}]: ${c.substring(0, 200)}...`).join("\n") : "None"}`;

  try {
    const result = await callLLM(systemPrompt, userPrompt);
    console.log(`>>> [CRAG] Rewriting query: "${originalQuery}" -> New Query: "${result}"`);
    return result || originalQuery;
  } catch (error) {
    console.error("Failed to rewrite query, returning original:", error);
    return originalQuery;
  }
}
