import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { QdrantClient } from "@qdrant/js-client-rest";

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";

console.log("QDRANT_URL:", QDRANT_URL);
console.log("Has API KEY:", !!process.env.QDRANT_API_KEY);

const clientDefault = new QdrantClient({
  url: QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const client6333 = new QdrantClient({
  url: QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  port: 6333,
});

const clientLocal = new QdrantClient({
  url: "http://localhost:6333",
});

async function run() {
  console.log("\n--- Testing clientDefault (No port specified) ---");
  try {
    const cols = await clientDefault.getCollections();
    console.log("Success! Collections count:", cols.collections.length);
  } catch (e: any) {
    console.error("Failed:", e.message || e);
  }

  console.log("\n--- Testing client6333 (Port 6333 explicitly specified) ---");
  try {
    const cols = await client6333.getCollections();
    console.log("Success! Collections count:", cols.collections.length);
  } catch (e: any) {
    console.error("Failed:", e.message || e);
  }

  console.log("\n--- Testing clientLocal (http://localhost:6333) ---");
  try {
    const cols = await clientLocal.getCollections();
    console.log("Success! Collections count:", cols.collections.length);
  } catch (e: any) {
    console.error("Failed:", e.message || e);
  }
}

run();
