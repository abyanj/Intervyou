import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import apiService from "../services/apiService";
import { useEffect } from "react";

export default function Upgrade({ currentPlan }) {
  useEffect(() => {
    document.title = "Upgrade - IntervYOU"; // Set the title dynamically

    // Fetch the user's current plan
  }, []);

  const features = [
    {
      plan: "Starter",
      price: "Free",
      description: "Try the basic features of IntervYOU.",
      details: ["5 Free Mock Interview", "Basic Feedback"],
      buttonText: currentPlan === "starter" ? "Current Plan" : "Downgrade",
      disabled: currentPlan == "starter",
    },
    {
      plan: "Pro",
      price: "$10 / month",
      description: "For professionals looking to sharpen their skills.",
      details: [
        "50 Mock Interviews",
        "Advanced Feedback & Analysis",
        "Priority Support",
      ],
      buttonText: currentPlan === "pro" ? "Current Plan" : "Upgrade",
      disabled: currentPlan == "pro",
    },
    {
      plan: "Enterprise",
      price: "Contact Us",
      description: "Custom solutions for teams and organizations.",
      details: [
        "Team Collaboration Features",
        "Custom Interview Packages",
        "Dedicated Support",
      ],
      buttonText: "Contact Us",
      disabled: false, // Placeholder for future inquiry feature
    },
  ];

  const handleProPurchase = async () => {
    try {
      // 1) Get current user
      const user = await apiService.getCurrentUser();
      const userId = user.id;

      // 2) Call Azure Function via apiService
      const { url } = await apiService.createProCheckoutSession(userId);

      // 3) Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error("Payment initiation error:", error.message);
      alert("Unable to initiate payment. Please try again.");
    }
  };

  const handleContactUs = () => {
    alert("Enterprise inquiries coming soon. Stay tuned!");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#E0E0E0",

        padding: "4rem 0", // Added more top padding to align with "How It Works"
        marginTop: "1rem", // Create spacing relative to the navbar
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          marginBottom: "2rem",
          fontWeight: "bold",
          color: "#BB86FC",
        }}
      >
        Upgrade Your IntervYOU Experience
      </Typography>
      <Typography
        variant="h6"
        align="center"
        sx={{
          marginBottom: "4rem",
          color: "#BDBDBD",
        }}
      >
        Unlock more features and enhance your interview preparation with our
        premium plans.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "#1f1f1f",
              color: "#fff",
              width: "300px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#BB86FC",
                  marginBottom: "1rem",
                }}
              >
                {feature.plan}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                {feature.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginBottom: "1.5rem", color: "#BDBDBD" }}
              >
                {feature.description}
              </Typography>
              <Box sx={{ marginBottom: "1.5rem" }}>
                {feature.details.map((detail, idx) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    • {detail}
                  </Typography>
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                disabled={feature.disabled}
                onClick={
                  feature.plan === "Pro"
                    ? handleProPurchase
                    : feature.plan === "Enterprise"
                    ? handleContactUs
                    : undefined
                }
                sx={{
                  backgroundColor: "#BB86FC",
                  color: feature.disabled ? "#999" : "#fff",
                  "&:hover": {
                    backgroundColor: feature.disabled ? "#444" : "#9b69d4",
                  },
                  borderRadius: "30px",
                  padding: "0.5rem 1.5rem",
                }}
              >
                {feature.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
