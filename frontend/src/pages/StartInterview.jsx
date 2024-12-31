import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ReactWebcam from "react-webcam";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import useSpeechToText from "react-hook-speech-to-text";
import apiService from "../services/apiService"; // Import the updated service

function StartInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [preparationTime, setPreparationTime] = useState(30);
  const [answerTime, setAnswerTime] = useState(60);
  const [phase, setPhase] = useState("preparation");
  const [feedbackExists, setFeedbackExists] = useState(false); // New state for feedback check
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false); // New state for saving loader
  const [transitioning, setTransitioning] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState("");
  const webcamRef = useRef(null);

  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    const checkFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from("user_answers")
          .select("*")
          .eq("mock_id_ref", id);

        if (error) {
          console.error("Error checking feedback:", error.message);
          return;
        }

        if (data && data.length > 0) {
          setFeedbackExists(true);
          navigate(`/dashboard/interview/${id}/feedback`);
        }
      } catch (err) {
        console.error("Unexpected error while checking feedback:", err.message);
      }
    };

    checkFeedback();
  }, [id, navigate]);

  useEffect(() => {
    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from("mock_interviews")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching interview:", error.message);
      } else {
        setInterview(data);
      }
      setLoading(false);
    };

    fetchInterview();
  }, [id]);

  useEffect(() => {
    if (!interview) return;

    if (phase === "preparation") {
      if (preparationTime > 0) {
        const timer = setTimeout(() => {
          setPreparationTime((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        handleStartAnswering();
      }
    }
  }, [preparationTime, phase, interview]);

  useEffect(() => {
    if (phase === "answering") {
      if (answerTime > 0) {
        const timer = setTimeout(() => {
          setAnswerTime((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        handleFinishAnswering();
      }
    }
  }, [answerTime, phase]);

  useEffect(() => {
    const transcript = results.map((result) => result.transcript).join(" ");
    setCurrentTranscription(transcript);
  }, [results]);

  const handleStartAnswering = () => {
    if (phase !== "preparation") return;

    setPhase("answering");
    setPreparationTime(0);
    setCurrentTranscription("");
    if (isRecording) stopSpeechToText();
    setResults([]);
    startSpeechToText();
  };

  const handleFinishAnswering = async () => {
    if (phase !== "answering") return;

    setSaving(true); // Show saving loader
    setPhase("completed");
    stopSpeechToText();

    const finalTranscription = currentTranscription.trim();
    console.log(finalTranscription);
    const currentQuestion = JSON.parse(interview.questions_and_answers)[
      currentQuestionIndex
    ];
    const mock_id_ref = id;

    try {
      const feedback = await apiService.generateFeedback(
        currentQuestion.question,
        finalTranscription ? finalTranscription : "no answer"
      );

      console.log("Feedback:", feedback);

      const feedbackData = {
        mock_id_ref,
        question: currentQuestion.question,
        correct_ans: currentQuestion.answer,
        user_ans: finalTranscription || "no answer",
        feedback: feedback.feedback || "", // Feedback from AI
        rating: feedback.rating || 1, // Rating from AI
        created_at: new Date().toISOString(),
      };

      await apiService.saveFeedbackToSupabase(feedbackData);
    } catch (error) {
      console.error("Error generating feedback or saving:", error.message);
    }

    setSaving(false); // Hide saving loader
  };

  const handleNextQuestion = () => {
    if (transitioning || processing || saving) return;

    const totalQuestions = JSON.parse(interview.questions_and_answers).length;

    if (currentQuestionIndex + 1 < totalQuestions) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setPreparationTime(30);
        setAnswerTime(60);
        setPhase("preparation");
        setCurrentTranscription("");
        setTransitioning(false);
      }, 500);
    } else {
      navigate(`/dashboard/interview/${id}/feedback`);
    }
  };

  if (error) {
    return (
      <Typography variant="h6">
        Web Speech API is not available in this browser 🤷‍
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#0f0f0f",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ marginLeft: "1rem" }}>
          Loading interview...
        </Typography>
      </Box>
    );
  }

  const questions = JSON.parse(interview.questions_and_answers);
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box
      sx={{
        backgroundColor: "#0f0f0f",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        Interview in Progress
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          <strong>
            Question {currentQuestionIndex + 1} of {questions.length}:
          </strong>{" "}
          {currentQuestion.question}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          height: "400px",
          marginBottom: "1rem",
          border: "1px solid #444",
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ReactWebcam
          ref={webcamRef}
          audio={true}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>

      {phase === "preparation" && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">{`Interview will begin in: ${preparationTime}s`}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartAnswering}
            sx={{ marginTop: "1rem" }}
          >
            Begin Interview
          </Button>
        </Box>
      )}

      {phase === "answering" && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">{`Recording answer... Time left: ${answerTime}s`}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleFinishAnswering}
            sx={{ marginTop: "1rem" }}
          >
            Finish Answer
          </Button>
        </Box>
      )}

      {phase === "completed" && saving && (
        <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ marginTop: "1rem" }}>
            Saving answer...
          </Typography>
        </Box>
      )}

      {phase === "completed" && !saving && (
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleNextQuestion}
            sx={{ marginTop: "2rem" }}
            disabled={saving || transitioning}
          >
            {currentQuestionIndex + 1 < questions.length
              ? "Next Question"
              : "Finish Interview"}
          </Button>
        </Box>
      )}

      {transitioning && <CircularProgress sx={{ marginTop: "2rem" }} />}
    </Box>
  );
}

export default StartInterview;
