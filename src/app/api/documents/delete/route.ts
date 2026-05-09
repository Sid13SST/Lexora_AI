import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { qdrantClient, COLLECTION_NAME } from '@/lib/rag/qdrant';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 1. Delete from Prisma
    await prisma.document.delete({
      where: { id }
    });

    // 2. Delete from Qdrant
    // Note: In a production app, we would use points filter to delete specific document chunks
    await qdrantClient.delete(COLLECTION_NAME, {
      filter: {
        must: [
          {
            key: "documentId",
            match: { value: id }
          }
        ]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
