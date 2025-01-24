import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirect to the home page
  };

  return (
    <Box
      sx={{
        minHeight: "93%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        color: "white",
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: "bold", color: "#BB86FC" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: "2rem" }}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        sx={{
          padding: "0.8rem 2rem",
          borderRadius: "30px",
          backgroundColor: "#BB86FC",
          "&:hover": {
            backgroundColor: "#9b69d4",
          },
        }}
      >
        Go Back Home
      </Button>
    </Box>
  );
}
