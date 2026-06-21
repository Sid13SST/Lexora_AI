import { NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/rag/embeddings';
import { qdrantClient, COLLECTION_NAME } from '@/lib/rag/qdrant';
import { correctQuery, checkRelevance, rewriteQuery } from '@/lib/rag/crag';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
  }

  try {
    const { messages, documentId } = await req.json();
    
    // Ensure collection exists
    const { initQdrant } = await import('@/lib/rag/qdrant');
    await initQdrant();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const originalQuery = messages[messages.length - 1].content;

    // 1. Correct query if there are typos or errors
    const correctedQuery = await correctQuery(originalQuery);

    let currentQuery = correctedQuery;
    const accumulatedRelevantChunks: any[] = [];
    const seenChunkIds = new Set<string>();

    const maxIterations = 3;
    for (let iter = 0; iter < maxIterations; iter++) {
      console.log(`>>> [CRAG] Iteration ${iter + 1} with query: "${currentQuery}"`);
      
      // 2. Generate Embedding for the query
      const queryVector = await generateEmbedding(currentQuery);

      // 3. Retrieve relevant chunks from Qdrant
      let filter = undefined;
      if (documentId) {
        filter = {
          must: [
            {
              key: "documentId",
              match: {
                value: documentId
              }
            }
          ]
        };
      }

      let searchResults: any[] = [];
      try {
        searchResults = await qdrantClient.search(COLLECTION_NAME, {
          vector: queryVector,
          limit: 5,
          filter: filter,
        });
      } catch (searchError: any) {
        console.warn(">>> [CHAT] Search failed:", searchError.message);
        searchResults = [];
      }

      if (searchResults.length === 0) {
        console.log(">>> [CRAG] No chunks retrieved in this iteration.");
        break;
      }

      // 4. Assess chunk relevance
      let hasIrrelevantChunk = false;
      const relevantInThisIter: any[] = [];
      const irrelevantInThisIter: string[] = [];

      for (const result of searchResults) {
        if (result.payload && result.score > 0.5) { // Similarity threshold
          const { content } = result.payload as any;
          const isRelevant = await checkRelevance(currentQuery, content);
          if (isRelevant) {
            relevantInThisIter.push(result);
          } else {
            irrelevantInThisIter.push(content);
            hasIrrelevantChunk = true;
          }
        }
      }

      // Add unique relevant chunks to the accumulated list
      for (const res of relevantInThisIter) {
        const chunkId = res.id || res.payload.content;
        if (!seenChunkIds.has(chunkId)) {
          seenChunkIds.add(chunkId);
          accumulatedRelevantChunks.push(res);
        }
      }

      // If all chunks were relevant or we hit the maximum iteration, terminate
      if (!hasIrrelevantChunk || iter === maxIterations - 1) {
        console.log(`>>> [CRAG] Terminating loop. hasIrrelevantChunk: ${hasIrrelevantChunk}, Iteration: ${iter + 1}`);
        break;
      }

      // If we had irrelevant chunks, rewrite query for next iteration using feedback
      const relevantTexts = relevantInThisIter.map(r => r.payload.content);
      currentQuery = await rewriteQuery(currentQuery, relevantTexts, irrelevantInThisIter);
    }

    // 5. Construct Context
    let contextText = '';
    const citations: any[] = [];
    
    accumulatedRelevantChunks.forEach((result, index) => {
      const { content, pageNumber } = result.payload as any;
      contextText += `\n--- Chunk ${index + 1} (Page ${pageNumber}) ---\n${content}\n`;
      citations.push({
        pageNumber,
        snippet: content.substring(0, 100) + '...',
        score: result.score
      });
    });

    // 6. Grounded Prompt
    const systemPrompt = `You are Lexora AI, a helpful and intelligent assistant.
Your task is to answer the user's question based ONLY on the provided context from their uploaded document.

CRITICAL INSTRUCTIONS:
1. If the answer cannot be found in the provided context, you MUST explicitly state exactly: "This information is not available in the uploaded document." Do not try to guess or use outside knowledge.
2. If you use information from the context, include citations like [Page X] in your response.
3. Be concise, professional, and clear.

CONTEXT:
${contextText || "No relevant context found in the document."}
`;

    // 7. Call OpenRouter using standard fetch to support streaming easily
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return NextResponse.json({
      role: 'assistant',
      content: answer,
      citations: citations.length > 0 ? citations : null
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
