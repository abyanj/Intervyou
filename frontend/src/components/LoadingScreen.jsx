// components/LoadingScreen.js
import { Box, Typography, CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        color: "#fff",
        flexDirection: "column",
        height: "100vh", // optional
      }}
    >
      <CircularProgress
        size={80}
        sx={{
          color: "#BB86FC",
          marginBottom: "1rem",
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: "#E0E0E0",
          fontWeight: "bold",
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        Loading Dashboard...
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#BDBDBD", marginTop: "0.5rem" }}
      >
        Please wait while we prepare your data.
      </Typography>
    </Box>
  );
}
