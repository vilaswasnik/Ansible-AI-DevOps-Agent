// openai.js
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askOpenAI(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    if (
      response &&
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('No response from OpenAI API.');
    }
  } catch (error) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch response from OpenAI.');
  }
}

module.exports = { askOpenAI };
