import { NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/rag/embeddings';
import { qdrantClient, COLLECTION_NAME } from '@/lib/rag/qdrant';

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

    const latestMessage = messages[messages.length - 1].content;

    // 1. Generate Embedding for the query
    const queryVector = await generateEmbedding(latestMessage);
    console.log(`>>> [CHAT] Query vector length: ${queryVector.length}`);

    // 2. Retrieve relevant chunks from Qdrant
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
      console.error(">>> [CHAT] SEARCH CRITICAL ERROR:", {
        message: searchError.message,
        status: searchError.status,
        data: searchError.data ? JSON.stringify(searchError.data) : 'N/A',
        url: searchError.url
      });
      searchResults = [];
    }

    // 3. Construct Context
    let contextText = '';
    const citations: any[] = [];
    
    searchResults.forEach((result, index) => {
      if (result.payload && result.score > 0.5) { // Similarity threshold
        const { content, pageNumber } = result.payload as any;
        contextText += `\n--- Chunk ${index + 1} (Page ${pageNumber}) ---\n${content}\n`;
        citations.push({
          pageNumber,
          snippet: content.substring(0, 100) + '...',
          score: result.score
        });
      }
    });

    // 4. Grounded Prompt
    const systemPrompt = `You are Lexora AI, a helpful and intelligent assistant.
Your task is to answer the user's question based ONLY on the provided context from their uploaded document.

CRITICAL INSTRUCTIONS:
1. If the answer cannot be found in the provided context, you MUST explicitly state exactly: "This information is not available in the uploaded document." Do not try to guess or use outside knowledge.
2. If you use information from the context, include citations like [Page X] in your response.
3. Be concise, professional, and clear.

CONTEXT:
${contextText || "No relevant context found in the document."}
`;

    // 5. Call OpenRouter using standard fetch to support streaming easily
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Equivalent to GPT-4.1 Mini requested
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: false, // For simplicity in this iteration, we can implement streaming later if needed, or use AI SDK
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
