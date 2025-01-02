import { supabase } from "../supabaseClient";

const BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL;

const apiService = {
  async generateQuestions(level, positionName, jobDescription) {
    try {
      const response = await fetch(`${BASE_URL}/api/generateQuestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level, positionName, jobDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const questions = await response.json();
      return questions;
    } catch (error) {
      console.error("Error generating questions:", error.message);
      throw error;
    }
  },

  async saveInterviewToSupabase(interviewData) {
    try {
      const { error } = await supabase
        .from("mock_interviews")
        .insert([interviewData]);
      if (error) {
        console.error("Error saving interview to database:", error.message);
        throw new Error("Failed to save interview to database");
      }
    } catch (error) {
      console.error("Unexpected error saving interview:", error.message);
      throw error;
    }
  },

  async generateFeedback(question, answer, maxRetries = 3, retryDelay = 10000) {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        console.log(`Attempt ${attempts + 1} to generate feedback...`);
        const response = await fetch(`${BASE_URL}/api/generateFeedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question, answer }),
        });

        if (response.ok) {
          const feedback = await response.json();
          return feedback;
        }

        if (response.status === 429) {
          console.warn("Rate limit hit. Retrying...");
          attempts++;
          if (attempts < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
          } else {
            throw new Error("Rate limit exceeded. Max retries reached.");
          }
        } else {
          throw new Error(
            `Failed to generate feedback: ${response.statusText}`
          );
        }
      } catch (error) {
        if (attempts >= maxRetries - 1) {
          console.error("Final attempt failed:", error.message);
          throw error; // Rethrow the error after max retries
        }
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  },

  async saveFeedbackToSupabase(feedbackData) {
    try {
      const { error } = await supabase
        .from("user_answers")
        .insert([feedbackData]);
      if (error) {
        console.error("Error saving feedback to database:", error.message);
        throw new Error("Failed to save feedback to database");
      }
    } catch (error) {
      console.error("Unexpected error saving feedback:", error.message);
      throw error;
    }
  },

  async deleteInterview(interviewId) {
    try {
      await supabase.from("mock_interviews").delete().eq("id", interviewId);
    } catch (error) {
      console.error("Unexpected error deleting interview:", error.message);
      throw error;
    }
  },
};

export default apiService;
