import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

function Success() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if session_id exists in the URL (Stripe adds this)
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // Store session flag to indicate a successful payment redirect
      localStorage.setItem("payment_success", "true");
      setIsAuthorized(true);
    } else {
      // Check if the session flag exists (user already redirected)
      const successFlag = localStorage.getItem("payment_success");
      if (successFlag === "true") {
        setIsAuthorized(true);
      } else {
        // Redirect unauthorized users
        navigate("/dashboard");
      }
    }
  }, [navigate, searchParams]);

  return isAuthorized ? (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#BB86FC",
            marginBottom: "1rem",
          }}
        >
          Payment Successful 🎉
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginBottom: "2rem", color: "#BDBDBD" }}
        >
          Thank you for upgrading to IntervYOU Pro! You can now create unlimited
          mock interviews and access advanced feedback.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            localStorage.removeItem("payment_success"); // Clear session flag
            navigate("/dashboard");
          }}
          sx={{
            backgroundColor: "#BB86FC",
            "&:hover": { backgroundColor: "#9b69d4" },
            padding: "0.8rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  ) : null;
}

export default Success;
