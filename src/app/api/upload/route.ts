import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { extractPagesFromPDF } from '@/lib/rag/pdf';
import { chunkText } from '@/lib/rag/chunking';
import { generateEmbedding } from '@/lib/rag/embeddings';
import { qdrantClient, COLLECTION_NAME, initQdrant } from '@/lib/rag/qdrant';

export async function POST(req: Request) {
  console.log(">>> [UPLOAD] Starting request processing...");
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log(">>> [UPLOAD] Error: No file found in form data");
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log(`>>> [UPLOAD] File received: ${file.name} (${file.type})`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let content = '';
    let pages: { content: string; pageNumber: number }[] = [];

    if (file.type === 'application/pdf') {
      console.log(">>> [UPLOAD] Parsing PDF...");
      try {
        pages = await extractPagesFromPDF(buffer);
        content = pages.map(p => p.content).join('\n');
        console.log(`>>> [UPLOAD] PDF parsed. Pages: ${pages.length}, Text length: ${content.length}`);
      } catch (err: any) {
        console.error(">>> [UPLOAD] PDF parse failed:", err);
        return NextResponse.json({ error: 'Failed to parse PDF', details: err.message }, { status: 500 });
      }
    } else if (file.type === 'text/plain') {
      content = buffer.toString('utf-8');
      pages = [{ content, pageNumber: 1 }];
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Document is empty' }, { status: 400 });
    }

    // Sanitize content (remove null bytes for PostgreSQL compatibility)
    const sanitizedContent = content.replace(/\0/g, '');

    // Save document to Prisma
    console.log(">>> [UPLOAD] Saving to Prisma...");
    const document = await prisma.document.create({
      data: {
        title: file.name,
        filename: file.name,
        mimeType: file.type,
        content: sanitizedContent,
      },
    });
    console.log(`>>> [UPLOAD] Document saved to Prisma: ${document.id}`);

    // Initialize Qdrant
    await initQdrant();

    // Chunk text page by page
    console.log(">>> [UPLOAD] Chunking...");
    const chunks = [];
    for (const page of pages) {
      const pageChunks = await chunkText(page.content.replace(/\0/g, ''), page.pageNumber);
      chunks.push(...pageChunks);
    }
    console.log(`>>> [UPLOAD] Created ${chunks.length} chunks across ${pages.length} pages`);

    // Generate embeddings
    console.log(">>> [UPLOAD] Generating embeddings...");
    const points = [];
    for (const chunk of chunks) {
      const vector = await generateEmbedding(chunk.content);
      points.push({
        id: uuidv4(),
        vector: vector,
        payload: {
          documentId: document.id,
          content: chunk.content,
          pageNumber: chunk.metadata.loc?.pageNumber || 1,
          chunkIndex: chunk.metadata.chunkIndex,
        },
      });
    }

    if (points.length > 0) {
      console.log(">>> [UPLOAD] Upserting to Qdrant...");
      await qdrantClient.upsert(COLLECTION_NAME, {
        wait: true,
        points: points,
      });
    }

    return NextResponse.json({
      message: 'Upload successful',
      documentId: document.id,
      chunkCount: chunks.length,
    });
  } catch (error: any) {
    console.error('>>> [UPLOAD] CRITICAL ERROR:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
