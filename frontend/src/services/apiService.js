// services/apiService.js
import { supabase } from "../supabaseClient";

const BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL;

const apiService = {
  // 1) Get the currently authenticated user from Supabase
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error(error?.message || "No user found");
    }
    return user;
  },

  async createProCheckoutSession(userId) {
    try {
      // Example: Azure Function endpoint at /api/CreateCheckoutSession
      const response = await fetch(`${BASE_URL}/api/createCheckoutSession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
      const data = await response.json();
      // Expecting something like { url: "https://checkout.stripe.com/..." }
      return data;
    } catch (error) {
      console.error("Error creating checkout session:", error.message);
      throw error;
    }
  },
  // 2) Fetch the user's profile from the 'profiles' table
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  // 3) Fetch all mock interviews created by a specific user
  async getMockInterviewsByUser(userId) {
    const { data, error } = await supabase
      .from("mock_interviews")
      .select("*")
      .eq("created_by", userId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  // Your existing code below...
  async generateQuestions(
    level,
    positionName,
    jobDescription,
    numberOfQuestions
  ) {
    try {
      const response = await fetch(`${BASE_URL}/api/generateQuestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
          positionName,
          jobDescription,
          numberOfQuestions,
        }),
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
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
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

  async getInterviewById(interviewId) {
    const { data, error } = await supabase
      .from("mock_interviews")
      .select("*")
      .eq("id", interviewId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async checkIfFeedbackExists(mockId) {
    const { data, error } = await supabase
      .from("user_answers")
      .select("id")
      .eq("mock_id_ref", mockId);

    if (error) {
      throw new Error(error.message);
    }
    return data; // array of existing feedback rows or empty array
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
