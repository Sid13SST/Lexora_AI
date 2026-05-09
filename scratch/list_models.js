require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  const result = await genAI.listModels();
  result.models.forEach(m => {
    if (m.supportedGenerationMethods.includes('embedContent')) {
      console.log(m.name, m.outputTokenLimit);
    }
  });
}

list();
