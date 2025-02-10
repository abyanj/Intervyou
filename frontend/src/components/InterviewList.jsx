/* eslint-disable react/prop-types */
// components/InterviewList.js
import { Box, Typography } from "@mui/material";

export default function InterviewList({ interviews, onNavigate, onDelete }) {
  if (!interviews || interviews.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "#ccc" }}>
        No mock interviews available yet. Start by creating your first
        interview!
      </Typography>
    );
  }

  return (
    <Box sx={{ marginTop: "1rem", borderTop: "1px solid #444" }}>
      {interviews.map((interview) => (
        <Box
          key={interview.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 0",
            borderBottom: "1px solid #444",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#1f1f1f",
            },
          }}
        >
          {/* Interview Details */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              paddingLeft: "1rem",
              gap: "2rem",
            }}
            onClick={() => onNavigate(`/interview/${interview.id}/feedback`)}
            style={{ cursor: "pointer" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                flex: 1,
                maxWidth: "30%",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {interview.position_title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#ccc",
                flex: "1",
                maxWidth: "20%",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              Level: {interview.experience_level}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666",
                flex: "1",
                maxWidth: "20%",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              Created: {new Date(interview.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          {/* Delete Button */}
          <Box sx={{ marginRight: "5rem" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => onDelete(interview.id)}
            >
              X
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
