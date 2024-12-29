// src/services/apiService.js
import { supabase } from '../supabaseClient';

const apiService = {
  async generateQuestions(prompt) {
    const response = await fetch(`${import.meta.env.VITE_AZURE_FUNCTION_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const { questions } = await response.json();
    return questions;
  },

  async saveInterviewToSupabase(interviewData) {
    const { error } = await supabase.from('mock_interviews').insert([interviewData]);
    if (error) {
      throw new Error('Failed to save interview to database');
    }
  },
};

export default apiService;
