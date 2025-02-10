// components/CreateInterviewCard.js
import { Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// eslint-disable-next-line react/prop-types
export default function CreateInterviewCard({ onClick }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1f1f1f",
        border: "2px dashed #444",
        borderRadius: "10px",
        height: "150px",
        cursor: "pointer",
        transition: "all 0.3s",
        "&:hover": { backgroundColor: "#2a2a2a" },
      }}
      onClick={onClick}
    >
      <AddCircleOutlineIcon sx={{ fontSize: "3rem", color: "#fff" }} />
    </Box>
  );
}
