import { QdrantClient } from "@qdrant/js-client-rest";

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";

export const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  port: QDRANT_URL.includes('https') ? 443 : 6333,
});

export const COLLECTION_NAME = "lexora_documents";

export async function initQdrant() {
  try {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 3072, // Matches gemini-embedding-001
          distance: "Cosine",
        },
      });
      
      // Create index for documentId filtering (Required by Qdrant Cloud)
      await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
        field_name: "documentId",
        field_schema: "keyword",
        wait: true
      });
      
      console.log(`Created Qdrant collection and index: ${COLLECTION_NAME}`);
    }
  } catch (error) {
    console.error("Error initializing Qdrant:", error);
  }
}
