// openai.js
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your .env file has this variable set
});

async function askOpenAI(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch response from OpenAI.');
  }
}

module.exports = { askOpenAI };
