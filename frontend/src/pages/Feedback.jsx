import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Feedback() {
  const { id } = useParams(); // Get the interview ID from the URL
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState(null); // To hold the interview details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Feedback - IntervYOU"; // Set the title dynamically
  }, []);

  useEffect(() => {
    const fetchFeedbackAndInterviewDetails = async () => {
      try {
        // Fetch feedback data
        const { data: feedback, error: feedbackError } = await supabase
          .from("user_answers")
          .select("*")
          .eq("mock_id_ref", id);

        if (feedbackError) {
          console.error("Error fetching feedback:", feedbackError.message);
          navigate("/404"); // Redirect to 404 page
          return;
        }

        // Fetch interview details
        const { data: interview, error: interviewError } = await supabase
          .from("mock_interviews")
          .select("*")
          .eq("id", id)
          .single();

        if (interviewError) {
          console.error(
            "Error fetching interview details:",
            interviewError.message
          );
          navigate("/404"); // Redirect to 404 page
          return;
        }

        setFeedbackData(feedback || []);
        setInterviewDetails(interview || null);
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error:", err.message);
        setLoading(false);
      }
    };

    fetchFeedbackAndInterviewDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ marginLeft: "1rem" }}>
          Loading feedback...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        color: "#fff",
        padding: "2rem",
        paddingBottom: "2rem", // Ensure spacing at the bottom
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      {/* Interview Details */}
      {interviewDetails && (
        <Paper
          sx={{
            padding: "2rem",
            backgroundColor: "#1f1f1f",
            marginBottom: "2rem",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: "1rem",
              textAlign: "center",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {interviewDetails.position_title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: "1rem",
              lineHeight: 1.6,
              fontSize: "1rem",
              color: "white",
            }}
          >
            <strong>Description:</strong>{" "}
            <span style={{ fontStyle: "italic" }}>
              {interviewDetails.position_description}
            </span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              color: "white",
            }}
          >
            Experience Level:{" "}
            <span style={{ fontWeight: "normal" }}>
              {interviewDetails.experience_level}
            </span>
          </Typography>
        </Paper>
      )}

      {/* Feedback Section */}
      {feedbackData.map((item, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: "#2a2a2a",
            color: "#fff",
            marginBottom: "1rem",
            borderRadius: "10px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ fontWeight: "bold" }}
          >
            <Typography>
              Question {index + 1}: {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "1rem",
                fontWeight: "bold",
                color: "#BB86FC",
              }}
            >
              Your Answer:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#333",
                borderRadius: "5px",
                color: "#fff", // Ensure text color is explicitly set
              }}
            >
              {item.user_ans || "N/A"}
            </Typography>
            <Divider sx={{ margin: "1rem 0", backgroundColor: "#444" }} />
            <Typography
              variant="body1"
              sx={{
                marginBottom: "1rem",
                fontWeight: "bold",
                color: "#81C784",
              }}
            >
              Sample Answer:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#333",
                borderRadius: "5px",
                color: "#fff", // Ensure text color is explicitly set
              }}
            >
              {item.correct_ans || "N/A"}
            </Typography>
            <Divider sx={{ margin: "1rem 0", backgroundColor: "#444" }} />
            <Typography
              variant="body1"
              sx={{
                marginBottom: "1rem",
                fontWeight: "bold",
                color: "#F48FB1",
              }}
            >
              Feedback:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#333",
                borderRadius: "5px",
                color: "#fff", // Ensure text color is explicitly set
              }}
            >
              {item.feedback || "No feedback provided"}
            </Typography>
            <Divider sx={{ margin: "1rem 0", backgroundColor: "#444" }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#FFCC00" }}
            >
              Rating: {item.rating || "N/A"} / 5
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default Feedback;
