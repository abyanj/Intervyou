import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactWebcam from 'react-webcam';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import InfoIcon from '@mui/icons-material/Info';

function Interview() {
  const { id } = useParams(); // Get the interview ID from the URL
  const navigate = useNavigate(); // For navigation to the start interview page
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const webcamRef = React.useRef(null);
  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);

  useEffect(() => {
    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from('mock_interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching interview:', error.message);
      } else {
        setInterview(data);
      }
      setLoading(false);
    };

    fetchInterview();
  }, [id]);

  const handleEnableCameraAndMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraEnabled(true);
      setMicrophoneEnabled(true);

      // Set up audio processing
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const level = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(level);
        requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Error enabling camera and microphone:', error.message);
      alert('Unable to access camera and microphone. Please check your browser settings.');
    }
  };

  const handleStartInterview = () => {
    navigate(`/dashboard/interview/${id}/start`);
  };

  if (loading) {
    return <Typography>Loading interview details...</Typography>;
  }

  if (!interview) {
    return <Typography>Interview not found.</Typography>;
  }

  return (
    <Box sx = {{ backgroundColor: '#0f0f0f',
        color: '#fff',
        padding: '2rem',
        paddingBottom: '4rem'}}>
    <Box sx={{ display: 'flex', flexDirection: 'row', padding: '2rem', backgroundColor: '#0f0f0f', color: '#fff', justifyContent: 'space-between', }}>
      {/* Left Section */}
      <Box sx={{ flex: 1, marginRight: '2rem' }}>
        <Card sx={{ backgroundColor: '#1f1f1f', color: '#fff', borderRadius: '10px', padding: '1rem' }}>
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: '1rem' }}> Interview Details</Typography>
            <Typography variant="body1"><strong>Position:</strong> {interview.position_title}</Typography>
            <Typography variant="body1" sx={{ marginTop: '0.5rem' }}><strong>Description:</strong> {interview.position_description}</Typography>
            <Typography variant="body1" sx={{ marginTop: '0.5rem' }}><strong>Experience Level:</strong> {interview.experience_level}</Typography>
            <Typography variant="body1" sx={{ marginTop: '0.5rem' }}><strong>Number of Questions:</strong> {JSON.parse(interview.questions_and_answers).length}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#292929', color: '#fff', marginTop: '1rem', borderRadius: '10px', padding: '1rem' }}>
          <CardContent>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <InfoIcon sx={{ marginRight: '0.5rem' }} /> Information
            </Typography>
            <Typography variant="body2">
              Enable your webcam and microphone to start the AI-generated mock interview. It contains 5 questions you can answer, and at the end, you’ll receive a report based on your responses. <strong>Note:</strong> We do not record your video, and webcam access can be disabled at any time.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Right Section */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: '#1f1f1f', borderRadius: '10px' }}>
        <Box sx={{ width: '100%', height: '60%', marginBottom: '1rem', border: '1px solid #444', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cameraEnabled ? (
            <ReactWebcam
              audio={false}
              ref={webcamRef}
              style={{ width: '100%', height: '100%', borderRadius: '10px' }}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <VideocamIcon sx={{ fontSize: '4rem', color: '#fff' }} />
              <MicIcon sx={{ fontSize: '4rem', color: '#fff' }} />
            </Box>
          )}
        </Box>

        {microphoneEnabled && (
          <Box sx={{ width: '80%', height: '10px', backgroundColor: '#444', borderRadius: '5px', overflow: 'hidden', marginTop: '1rem' }}>
            <Box
              sx={{
                width: `${Math.min(audioLevel, 100)}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                transition: 'width 0.1s ease-in-out',
              }}
            ></Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnableCameraAndMicrophone}
            disabled={cameraEnabled && microphoneEnabled}
          >
            Enable Camera & Microphone
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleStartInterview}
            disabled={!cameraEnabled || !microphoneEnabled}
          >
            Start Interview
          </Button>
        </Box>
      </Box>
    </Box>
    </Box>
  );
}

export default Interview;
