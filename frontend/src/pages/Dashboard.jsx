// pages/Dashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import apiService from "../services/apiService";

// Our sub-components
import LoadingScreen from "../components/LoadingScreen";

import CreateInterviewCard from "../components/CreateInterviewCard";
import InterviewList from "../components/InterviewList";
import AddInterviewModal from "../components/AddInterviewModal";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mockInterviews, setMockInterviews] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set the document title
  useEffect(() => {
    document.title = "Dashboard - IntervYOU";
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) Get the current user
        const user = await apiService.getCurrentUser();

        // 2) Get the user profile
        const profileData = await apiService.getUserProfile(user.id);
        setProfile(profileData);
        console.log(profileData);

        // 3) Get the user’s mock interviews
        const interviews = await apiService.getMockInterviewsByUser(user.id);
        setMockInterviews(interviews || []);
      } catch (error) {
        console.error("Error loading data:", error.message);
        navigate("/"); // or show some error message
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Handlers for the modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Submit new interview
  const handleAddInterview = async (interviewData) => {
    setIsSubmitting(true);
    try {
      // Generate questions
      const questions = await apiService.generateQuestions(
        interviewData.level,
        interviewData.positionName,
        interviewData.jobDescription,
        interviewData.numberOfQuestions
      );

      // Double-check user is logged in
      const user = await apiService.getCurrentUser();

      // Create interview entry
      const interviewEntry = {
        id: uuidv4(),
        position_title: interviewData.positionName,
        position_description: interviewData.jobDescription,
        experience_level: interviewData.level,
        created_by: user.id,
        questions_and_answers: JSON.stringify(questions),
        number_of_questions: interviewData.numberOfQuestions,
        created_at: new Date().toISOString(),
      };

      // Save to supabase
      await apiService.saveInterviewToSupabase(interviewEntry);

      // Navigate to the new interview
      navigate(`/interview/${interviewEntry.id}`);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating interview:", error.message);
      // Optionally show some error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete interview
  const handleDeleteInterview = async (interviewId) => {
    try {
      await apiService.deleteInterview(interviewId);
      setMockInterviews((prev) =>
        prev.filter((interview) => interview.id !== interviewId)
      );
    } catch (error) {
      console.error("Error deleting interview:", error.message);
      // Show an error
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", overflow: "auto" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "3rem" }}>
        <Typography
          variant="h4"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Welcome, {profile?.first_name || "User"}!
          <div>
            <AutoAwesomeIcon /> Credits: {profile?.credits}
          </div>
        </Typography>

        {/* Create Interview Section */}
        <Box
          sx={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Typography variant="h5">Create Your Interview</Typography>
          <CreateInterviewCard onClick={handleOpenModal} />
        </Box>

        {/* Past Interviews Section */}
        <Box sx={{ marginTop: "3rem" }}>
          <Typography
            variant="h5"
            sx={{ marginBottom: "1rem", color: "#fff", fontWeight: "bold" }}
          >
            Previous Mock Interviews
          </Typography>
          <InterviewList
            interviews={mockInterviews}
            onNavigate={navigate}
            onDelete={handleDeleteInterview}
          />
        </Box>
      </div>

      {/* Modal */}
      <AddInterviewModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddInterview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default Dashboard;
