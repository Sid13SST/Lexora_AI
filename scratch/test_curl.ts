import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.QDRANT_API_KEY;
const baseUrl = process.env.QDRANT_URL;

async function check(url: string) {
  console.log(`Checking URL: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        'api-key': apiKey || '',
      }
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Response text (truncated): ${text.substring(0, 200)}\n`);
  } catch (e: any) {
    console.error(`Error: ${e.message}\n`);
  }
}

async function run() {
  await check(`${baseUrl}/collections`);
  await check(`${baseUrl}:6333/collections`);
  await check(`https://6b281f63-14c9-4a66-a82f-81f355eaa6d1.us-east-2-0.aws.cloud.qdrant.io:6333/collections`);
}

run();
