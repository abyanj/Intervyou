const { app } = require("@azure/functions");
const axios = require("axios");

app.http("generateFeedback", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      // Handle CORS preflight
      return { status: 204, headers: corsHeaders };
    }

    const body = await request.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return {
        status: 400,
        body: JSON.stringify({
          error: "Missing question or answer in request body",
        }),
        headers: corsHeaders,
      };
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    if (!endpoint || !apiKey) {
      return {
        status: 500,
        body: JSON.stringify({
          error: "Azure OpenAI endpoint or API key is missing",
        }),
        headers: corsHeaders,
      };
    }

    const prompt = `
        Based on the following:
        Question: "${question}"
        Answer: "${answer}"
        Provide feedback in 2-3 sentences and a rating out of 5 in JSON format:
        {
            "rating": <number>,
            "feedback": "<your feedback>"
        }
        Also: The answer is being transcripted by an AI, so please ignore any grammatical error and provide feedback based on the content and give a rating that would make sense for an interviewer.`;

    let retryCount = 0;
    const maxRetries = 3;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (retryCount < maxRetries) {
      try {
        const response = await axios.post(
          endpoint,
          {
            messages: [
              {
                role: "system",
                content:
                  "You are an AI providing intelligent feedback on interview answers.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 300,
            temperature: 0.8,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": apiKey,
            },
          }
        );

        const feedbackContent = response.data.choices[0]?.message.content
          ?.replace("```json", "")
          ?.replace("```", "")
          ?.trim();

        return {
          status: 200,
          body: feedbackContent,
          headers: corsHeaders,
        };
      } catch (error) {
        if (error.response && error.response.status === 429) {
          retryCount++;
          console.warn(
            `Rate limit hit. Retrying in 10 seconds... (${retryCount}/${maxRetries})`
          );
          await sleep(10000); // Wait 2 seconds before retrying
        } else {
          context.log("ERROR: Failed to call Azure OpenAI API:", error.message);
          return {
            status: 500,
            body: JSON.stringify({
              error: "Failed to generate feedback",
              details: error.message,
            }),
            headers: corsHeaders,
          };
        }
      }
    }

    // If all retries fail
    context.log(
      "ERROR: All retry attempts failed. Returning rate limit response."
    );
    return {
      status: 429,
      body: JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
      }),
      headers: corsHeaders,
    };
  },
});
