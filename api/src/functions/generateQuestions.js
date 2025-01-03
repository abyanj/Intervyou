const { app } = require("@azure/functions");
const axios = require("axios");

app.http("generateQuestions", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.res = {
      headers: {
        "Access-Control-Allow-Origin": "*", // Replace * with specific origin in production
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };

    if (request.method === "OPTIONS") {
      // Handle CORS preflight
      return {
        status: 204,
        headers: context.res.headers,
      };
    }

    const body = await request.json();
    const { level, positionName, jobDescription, numberOfQuestions } = body;

    if (!level || !positionName || !jobDescription) {
      context.log("ERROR: Missing required fields in request body");
      return {
        status: 400,
        body: {
          error:
            "Missing required fields: level, positionName, or jobDescription",
        },
      };
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    if (!endpoint || !apiKey) {
      context.log(
        "ERROR: Azure OpenAI endpoint or API key is missing in environment variables"
      );
      return {
        status: 500,
        body: { error: "Azure OpenAI endpoint or API key is missing" },
      };
    }

    const prompt = `For the following information, a ${level} ${positionName} position with the following description: ${jobDescription}. Generate only ${numberOfQuestions} questions with verbal answers in JSON format, including fields for 'question' and 'answer', ie: [{ "question": '<sample_question>', "answer": '<sample_ans>'} ]and nothing else.`;

    try {
      const response = await axios.post(
        endpoint,
        {
          messages: [
            {
              role: "system",
              content: "You are an AI generating interview questions.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
        }
      );

      const generatedContent = response.data.choices[0]?.message.content;
      const mockResponse = generatedContent
        .replace("```json", "")
        .replace("```", "")
        .trim();

      context.log("Generated Mock Response:", mockResponse);
      return { status: 200, body: mockResponse };
    } catch (error) {
      context.log("ERROR: Failed to call Azure OpenAI API:", error.message);
      return {
        status: 500,
        body: {
          error: "Failed to generate questions",
          details: error.message,
        },
      };
    }
  },
});
