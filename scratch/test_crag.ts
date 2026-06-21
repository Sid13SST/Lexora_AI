import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { correctQuery, checkRelevance, rewriteQuery } from '../src/lib/rag/crag.js';

async function runTest() {
  console.log("=== Testing Query Correction ===");
  const corrected = await correctQuery("wat is the main topc of this documentt?");
  console.log(`Result: "${corrected}"\n`);

  console.log("=== Testing Relevance Check ===");
  const isRelevant = await checkRelevance(
    "How to configure environment variables?",
    "To configure environment variables, create a .env file in the root directory and add the key-value pairs."
  );
  console.log(`Is Relevant: ${isRelevant}\n`);

  console.log("=== Testing Query Rewriting ===");
  const rewritten = await rewriteQuery(
    "How to configure environment variables?",
    ["The root directory contains a configuration file."],
    ["Do not place configuration files in the src folder."]
  );
  console.log(`Rewritten Query: "${rewritten}"\n`);
}

runTest().catch(console.error);
