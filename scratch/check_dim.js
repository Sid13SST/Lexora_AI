const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent("Hello world");
    console.log('Embedding Length:', result.embedding.values.length);
  } catch (err) {
    console.error('Failed to get embedding:', err);
  }
}

test();
