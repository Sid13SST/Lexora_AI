require('dotenv').config();
const { QdrantClient } = require('@qdrant/js-client-rest');

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  port: 443
});

const COLLECTION_NAME = "lexora_documents";

async function reset() {
  console.log("Attempting to delete collection...");
  try {
    await qdrantClient.deleteCollection(COLLECTION_NAME);
    console.log("Collection deleted successfully.");
  } catch (e) {
    console.log("Collection might not exist, skipping delete.");
  }
}

reset();
