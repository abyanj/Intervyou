import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AddInterviewModal from "../components/AddInterviewModal";
import { Box, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";

import apiService from "../services/apiService";

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockInterviews, setMockInterviews] = useState([]);

  useEffect(() => {
    const loadUserAndProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error(
            "Error fetching user:",
            userError?.message || "No user found"
          );
          navigate("/");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          navigate("/");
          return;
        }

        setProfile(profileData);

        const { data: interviews, error: interviewError } = await supabase
          .from("mock_interviews")
          .select("*")
          .eq("created_by", user.id);

        if (interviewError) {
          console.error("Error fetching interviews:", interviewError.message);
        } else {
          setMockInterviews(interviews || []);
        }
      } catch (error) {
        console.error("Unexpected error loading profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndProfile();
  }, [navigate]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddInterview = async (interviewData) => {
    setIsSubmitting(true);
    try {
      const questions = await apiService.generateQuestions(
        interviewData.level,
        interviewData.positionName,
        interviewData.jobDescription
      );

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("Error: Unable to identify the user. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      const interviewEntry = {
        id: uuidv4(),
        position_title: interviewData.positionName,
        position_description: interviewData.jobDescription,
        experience_level: interviewData.level,
        created_by: user.id,
        questions_and_answers: JSON.stringify(questions),
        created_at: new Date().toISOString(),
      };

      await apiService.saveInterviewToSupabase(interviewEntry);
      navigate(`/dashboard/interview/${interviewEntry.id}`);

      setOpenModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteInterview = async (interviewId) => {
    try {
      const { error } = await apiService.deleteInterview(interviewId);

      if (error) {
        console.error("Error deleting interview:", error.message);
        alert("Failed to delete the interview. Please try again.");
        return;
      }

      // Update the state to remove the deleted interview
      setMockInterviews((prev) =>
        prev.filter((interview) => interview.id !== interviewId)
      );
    } catch (error) {
      console.error(
        "Unexpected error while deleting interview:",
        error.message
      );
      alert("Unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#0f0f0f",
          color: "#fff",
          flexDirection: "column",
        }}
      >
        <CircularProgress
          size={80}
          sx={{
            color: "#BB86FC", // Matches the theme
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

  return (
    <div>
      <div style={{ backgroundColor: "#0f0f0f", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem" }}>
          <Typography variant="h4">
            Welcome, {profile?.first_name || "User"}!
          </Typography>

          <Box sx={{ marginTop: "2rem" }}>
            <Typography variant="h5">Create Your Mock Interview</Typography>
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
              onClick={handleOpenModal}
            >
              <AddCircleOutlineIcon sx={{ fontSize: "3rem", color: "#fff" }} />
            </Box>
          </Box>

          <Box sx={{ marginTop: "3rem" }}>
            <Typography
              variant="h5"
              sx={{ marginBottom: "1rem", color: "#fff", fontWeight: "bold" }}
            >
              Previous Mock Interviews
            </Typography>
            {mockInterviews.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                No mock interviews available yet. Start by creating your first
                interview!
              </Typography>
            ) : (
              <Box sx={{ marginTop: "1rem", borderTop: "1px solid #444" }}>
                {mockInterviews.map((interview) => (
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
                        gap: "2rem", // Adds space between items
                      }}
                      onClick={() =>
                        navigate(
                          `/dashboard/interview/${interview.id}/feedback`
                        )
                      }
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
                        Created:{" "}
                        {new Date(interview.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {/* Delete Button */}
                    <Box sx={{ marginLeft: "1rem" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleDeleteInterview(interview.id)}
                      >
                        X
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </div>
        <AddInterviewModal
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={handleAddInterview}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default Dashboard;
