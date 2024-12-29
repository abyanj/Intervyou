require('dotenv').config(); 

const axios = require('axios');

module.exports = async function (context, req) {
  const { prompt } = req.body;

  if (!prompt) {
    context.res = {
      status: 400,
      body: 'Missing prompt in request body',
    };
    return;
  }

  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
  console.log('Azure Endpoint:', process.env.AZURE_OPENAI_ENDPOINT);
  console.log('Azure API Key:', process.env.AZURE_OPENAI_API_KEY);


  if (!azureEndpoint || !azureApiKey) {
    context.res = {
      status: 500,
      body: 'Azure OpenAI endpoint or API key is missing',
    };
    return;
  }

  try {
    const response = await axios.post(
      azureEndpoint,
      {
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.7,
        n: 1,
        stop: null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey,
        },
      }
    );

    const questions = response.data.choices[0]?.text.split('\n').filter((q) => q.trim() !== '');

    context.res = {
      status: 200,
      body: { questions },
    };
  } catch (error) {
    context.log('Error calling Azure OpenAI API:', error.message);
    context.res = {
      status: 500,
      body: 'Failed to generate questions',
    };
  }
};
