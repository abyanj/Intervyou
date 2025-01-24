import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ReactWebcam from "react-webcam";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import useSpeechToText from "react-hook-speech-to-text";
import apiService from "../services/apiService"; // Import the updated service
import { PlayCircleFilledWhite, Timer } from "@mui/icons-material";

function StartInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [preparationTime, setPreparationTime] = useState(30);
  const [answerTime, setAnswerTime] = useState(60);
  const [phase, setPhase] = useState("preparation");
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
    document.title = "Setup - IntervYOU"; // Set the title dynamically
  }, []);
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
          navigate(`/interview/${id}/feedback`);
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
    if (transitioning || saving) return;

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
      navigate(`/interview/${id}/feedback`);
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
        color: "#fff",
        padding: "2rem",
        textAlign: "center",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          marginBottom: "2rem",
          textAlign: "center",
          backgroundColor: "#0f0f0f",
          borderRadius: "10px",
          padding: "1rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#E0E0E0" }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>
        <Box
          sx={{
            position: "relative",
            height: "8px",
            backgroundColor: "#444",
            borderRadius: "4px",
            overflow: "hidden",
            marginTop: "1rem",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              height: "100%",
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
              backgroundColor: "#BB86FC",
              transition: "width 0.5s ease-in-out",
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#0f0f0f",
          borderRadius: "12px",
          padding: "2rem",
          margin: "2rem 0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          gap: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {currentQuestion.question}
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxWidth: "471px",
            height: "350px",
            margin: "auto",
            borderRadius: "10px",
            overflow: "hidden",
            border: "2px solid #BB86FC",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
          }}
        >
          <ReactWebcam
            ref={webcamRef}
            audio
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
        {phase === "preparation" && (
          <Box sx={{ textAlign: "center", paddingTop: "2rem" }}>
            <Box>
              <Timer
                sx={{ fontSize: 40, marginBottom: "1rem", color: "#BB86FC" }}
              />
              <Typography variant="h6">{`Interview will begin in: ${preparationTime}s`}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartAnswering}
              sx={{
                marginTop: "1rem",
                backgroundColor: "#2196f3", // Blue shade for start
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#1976d2", // Darker blue on hover
                },
                fontWeight: "bold",
                padding: "0.8rem 2rem",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            >
              Begin Interview
            </Button>
          </Box>
        )}

        {phase === "answering" && (
          <Box sx={{ textAlign: "center", paddingTop: "2rem" }}>
            <PlayCircleFilledWhite
              sx={{ fontSize: 40, marginBottom: "1rem", color: "#81C784" }}
            />

            <Typography variant="h6">{`Recording answer... Time left: ${answerTime}s`}</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFinishAnswering}
              sx={{
                marginTop: "1rem",
                backgroundColor: "#BB86FC", // Red shade for emphasis
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#863ddf", // Darker red on hover
                },
                fontWeight: "bold",
                padding: "0.8rem 2rem",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            >
              Finish Answer
            </Button>
          </Box>
        )}

        {phase === "completed" && saving && (
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <CircularProgress
              sx={{
                color: "#FF5722", // Orange shade for loader
                marginBottom: "1rem",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#E0E0E0",
                fontWeight: "bold",
              }}
            >
              Saving answer
            </Typography>
          </Box>
        )}

        {phase === "completed" && !saving && (
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleNextQuestion}
              sx={{
                marginTop: "2rem",
                backgroundColor: "#4caf50", // Green shade for success
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#388e3c", // Darker green on hover
                },
                fontWeight: "bold",
                padding: "0.8rem 2rem",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            >
              {currentQuestionIndex + 1 < questions.length
                ? "Next Question"
                : "Finish Interview"}
            </Button>
            {transitioning && <CircularProgress sx={{ marginTop: "2rem" }} />}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default StartInterview;
