import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

function Cancel() {
  const navigate = useNavigate();

  return (
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
            color: "#FF5722",
            marginBottom: "1rem",
          }}
        >
          Payment Canceled
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginBottom: "2rem", color: "#BDBDBD" }}
        >
          Your payment was not completed. You can try again or return to the
          dashboard.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/upgrade")}
            sx={{
              backgroundColor: "#BB86FC",
              "&:hover": { backgroundColor: "#9b69d4" },
              padding: "0.8rem 2rem",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/dashboard")}
            sx={{
              color: "#BB86FC",
              borderColor: "#BB86FC",
              "&:hover": { borderColor: "#9b69d4", color: "#9b69d4" },
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
    </Box>
  );
}

export default Cancel;
