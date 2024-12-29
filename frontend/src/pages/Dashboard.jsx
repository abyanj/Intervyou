import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Ensure this is correctly initialized
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AddInterviewModal from '../components/AddInterviewModal';
import { Box, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import apiService from '../services/apiService'; // Ensure this service is implemented

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const loadUserAndProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('Error fetching user:', userError?.message || 'No user found');
          navigate('/');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          navigate('/');
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Unexpected error loading profile:', error.message);
      } finally {
        setLoading(false); // Ensure loading is stopped even if an error occurs
      }
    };

    loadUserAndProfile();
  }, [navigate]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddInterview = async (interviewData) => {
    try {
      console.log('Submitting Interview Data:', interviewData);

      const prompt = `Create 5 interview questions along with answers for a ${interviewData.level} ${interviewData.positionName} position with the following description: ${interviewData.jobDescription} in JSON format`;

      // const mockResponse = await apiService.generateQuestions(prompt);
      // console.log('Generated Mock Response:', mockResponse);

      // const interviewPayload = {
      //   ...interviewData,
      //   mockResponse: JSON.stringify(mockResponse),
      //   createdBy: profile?.id,
      //   createdAt: new Date().toISOString(),
      // };

      // await apiService.saveInterviewToSupabase(interviewPayload);

      alert('Interview questions generated and saved successfully!');
      setOpenModal(false);
    } catch (error) {
      console.error('Error processing interview:', error.message);
      alert('An error occurred while generating or saving the interview.');
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#fff', backgroundColor: '#0f0f0f', height: '100vh' }}>
        <h3 style={{ padding: '2rem' }}>Loading...</h3>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: '#fff' }}>
      <ResponsiveAppBar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem' }}>
        <Typography variant="h4">Welcome, {profile?.first_name || 'User'}!</Typography>

        <Box sx={{ marginTop: '2rem' }}>
          <Typography variant="h5">Create Your Mock Interview</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1f1f1f',
              border: '2px dashed #444',
              borderRadius: '10px',
              height: '150px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { backgroundColor: '#2a2a2a' },
            }}
            onClick={handleOpenModal}
          >
            <AddCircleOutlineIcon sx={{ fontSize: '3rem', color: '#fff' }} />
          </Box>
        </Box>

        <Box sx={{ marginTop: '3rem' }}>
          <Typography variant="h5">Previous Mock Interviews</Typography>
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            No mock interviews available yet. Start by creating your first interview!
          </Typography>
        </Box>
      </div>
      <AddInterviewModal open={openModal} onClose={handleCloseModal} onSubmit={handleAddInterview} />
    </div>
  );
}

export default Dashboard;
