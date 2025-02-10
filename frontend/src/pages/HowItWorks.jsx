import { Box, Typography, Grid, Paper, Avatar } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import FeedbackIcon from "@mui/icons-material/Feedback";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import { useEffect } from "react";
function HowItWorks() {
  useEffect(() => {
    document.title = "How it works - IntervYOU"; // Set the title dynamically
  }, []);
  const steps = [
    {
      icon: <QuestionAnswerIcon sx={{ fontSize: 40, color: "#90CAF9" }} />,
      title: "Mock Interview",
      description:
        "Start by selecting the position, experience level, and providing a job description. Our AI generates realistic questions tailored to your needs.",
    },
    {
      icon: <FeedbackIcon sx={{ fontSize: 40, color: "#F48FB1" }} />,
      title: "Answer Questions",
      description:
        "Simulate a real interview by answering the questions. Our AI provides instant transcription of your answers.",
    },
    {
      icon: <TaskAltIcon sx={{ fontSize: 40, color: "#81C784" }} />,
      title: "Get Feedback",
      description:
        "Receive detailed feedback and ratings for each answer to help you identify strengths and improve.",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#E0E0E0",
        height: "auto",
        padding: "2rem 10rem",
      }}
    >
      {/* Centered Content Wrapper */}
      <Box sx={{ maxWidth: "1300px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: "3rem",
            padding: "2rem",
            backgroundColor: "#1E1E1E",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#BB86FC",
              textShadow: "2px 2px #000",
            }}
          >
            How It Works
          </Typography>
          <Typography variant="h6" sx={{ marginTop: "1rem", color: "#BDBDBD" }}>
            Your journey to acing interviews starts here. Learn how our platform
            guides you through every step.
          </Typography>
        </Box>

        {/* Steps Section */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            marginBottom: "2rem",
            color: "#BB86FC",
          }}
        >
          Steps to Success
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={6}
                sx={{
                  height: "300px", // Increased height for better spacing
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "1.5rem",
                  backgroundColor: "#1E1E1E",
                  borderRadius: "15px",
                  overflowY: "auto", // Allow scrolling if content overflows
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "#232323",
                  },
                }}
              >
                <Avatar
                  sx={{
                    marginBottom: "1rem",
                    backgroundColor: "#333",
                    width: 60,
                    height: 60,
                  }}
                >
                  {step.icon}
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#BDBDBD",
                    textAlign: "justify",
                    lineHeight: 1.5,
                  }}
                >
                  {step.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Coming Soon Section */}
        <Box
          sx={{
            marginTop: "4rem",
            textAlign: "center",
            padding: "2rem",
            color: "#F9FAFB",
          }}
        >
          <Typography
            variant="h4"
            sx={{ marginBottom: "1rem", color: "#90CAF9" }}
          >
            Coming Soon 🚀
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={6}
                sx={{
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                  backgroundColor: "#1E1E1E",
                  borderRadius: "15px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "#232323",
                  },
                }}
              >
                <EditNoteIcon
                  sx={{ fontSize: 50, color: "#F48FB1", marginBottom: "1rem" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  AI-Powered Resume Builder
                </Typography>
                <Typography variant="body2" sx={{ color: "#BDBDBD" }}>
                  Automatically craft professional resumes based on your mock
                  interviews.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={6}
                sx={{
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                  backgroundColor: "#1E1E1E",
                  borderRadius: "15px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "#232323",
                  },
                }}
              >
                <VideoCameraFrontIcon
                  sx={{ fontSize: 50, color: "#81C784", marginBottom: "1rem" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Video Interview Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: "#BDBDBD" }}>
                  Get AI-driven feedback on your body language and speaking
                  style.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default HowItWorks;
