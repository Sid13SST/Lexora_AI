const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const models = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
      .then(r => r.json());
    console.log('Available Models:', JSON.stringify(models, null, 2));
  } catch (err) {
    console.error('Failed to list models:', err);
  }
}

test();
