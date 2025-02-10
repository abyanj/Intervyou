import { Box, Typography } from "@mui/material";

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Mock Interview",
      description:
        "Start by selecting the position, experience level, and providing a job description. Our AI generates realistic questions tailored to your needs.",
    },
    {
      number: "2",
      title: "Answer Questions",
      description:
        "Simulate a real interview by answering the questions. Our AI provides instant transcription of your answers.",
    },
    {
      number: "3",
      title: "Get Feedback",
      description:
        "Receive detailed feedback and ratings for each answer to help you identify strengths and improve.",
    },
  ];

  const comingSoonFeatures = [
    {
      title: "AI-Powered Resume Builder",
      description:
        "Automatically craft professional resumes based on your mock interviews.",
    },
    {
      title: "Video Interview Analysis",
      description:
        "Get AI-driven feedback on your body language and speaking style.",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#E0E0E0",
        textAlign: "center",
        padding: "4rem 1rem",
      }}
    >
      {/* Header Section */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#BB86FC",
          marginBottom: "2rem",
        }}
      >
        How It Works
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: "#BDBDBD",
          marginBottom: "4rem",
        }}
      >
        Follow these simple steps to start your journey to success.
      </Typography>

      {/* Steps Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              textAlign: "center",
              flex: "1 1 auto",
              minWidth: "300px",
              position: "relative",
            }}
          >
            {/* Number */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "#BB86FC",
                marginBottom: "1rem",
              }}
            >
              {step.number}
            </Typography>

            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              {step.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: "#BDBDBD",
                maxWidth: "300px",
                margin: "0 auto",
              }}
            >
              {step.description}
            </Typography>

            {/* Curvy Arrow (except for the last step) */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "-70px",
                  transform: "translateY(-50%)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="50"
                  viewBox="0 0 100 50"
                  fill="none"
                >
                  <path
                    d="M0 25 C50 0, 50 50, 100 25"
                    stroke="#BB86FC"
                    strokeWidth="2"
                    fill="transparent"
                  />
                  <polygon points="100,25 90,20 90,30" fill="#BB86FC" />
                </svg>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Coming Soon Section */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#BB86FC",
          marginTop: "4rem",
          marginBottom: "2rem",
        }}
      >
        Coming Soon 🚀
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {comingSoonFeatures.map((feature, index) => (
          <Box
            key={index}
            sx={{
              textAlign: "center",
              flex: "1 1 auto",
              minWidth: "300px",
              maxWidth: "400px",
              padding: "2rem",
              backgroundColor: "#1E1E1E",
              borderRadius: "15px",
              margin: "1rem 0",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#E0E0E0",
                marginBottom: "0.5rem",
              }}
            >
              {feature.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#BDBDBD",
              }}
            >
              {feature.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default HowItWorks;
