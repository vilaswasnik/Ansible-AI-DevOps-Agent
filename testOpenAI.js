// testOpenai.js
const { askOpenAI } = require('./public/scripts/openai');

(async () => {
  try {
    const response = await askOpenAI('Say hello!');
    console.log('OpenAI Response:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
