/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export interface DocumentChunk {
  content: string;
  metadata: {
    loc?: {
      pageNumber: number;
    };
    chunkIndex: number;
  };
}

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export async function chunkText(text: string, pageNumber: number = 1): Promise<DocumentChunk[]> {
  const chunks = await textSplitter.createDocuments([text], [{ loc: { pageNumber } }]);
  
  return chunks.map((chunk: any, i: number) => ({
    content: chunk.pageContent,
    metadata: {
      ...chunk.metadata,
      chunkIndex: i,
    },
  }));
}
