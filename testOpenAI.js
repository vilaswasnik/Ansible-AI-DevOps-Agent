// testOpenai.js
const { askOpenAI } = require('./public/scripts/openai');

(async () => {
  const prompt = 'What is the capital of France?';
  try {
    const response = await askOpenAI(prompt);
    console.log('OpenAI Response:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
