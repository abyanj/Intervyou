import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Button, Typography, TextField, MenuItem } from '@mui/material';

const levels = ['Intern', 'Junior', 'Intermediate', 'Senior', 'Senior+'];

const AddInterviewModal = ({ onSubmit, open, onClose }) => {
  const [positionName, setPositionName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [level, setLevel] = useState('');

  const isFormValid = positionName.trim() !== '' && jobDescription.trim() !== '' && level !== '';

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit({ positionName, jobDescription, level });
      handleClose(); // Reset fields after submission
    }
  };

  const handleClose = () => {
    setPositionName('');
    setJobDescription('');
    setLevel('');
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setPositionName('');
      setJobDescription('');
      setLevel('');
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#1f1f1f',
          color: '#fff',
          border: '2px solid #444',
          boxShadow: 24,
          p: 4,
          borderRadius: '10px',
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Start New Mock Interview
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Please enter the details for your mock interview.
        </Typography>

        <TextField
          fullWidth
          label="Position Name"
          variant="outlined"
          margin="normal"
          value={positionName}
          onChange={(e) => setPositionName(e.target.value)}
          sx={{
            input: { color: '#fff', backgroundColor: '#2a2a2a' },
            label: { color: '#ccc' },
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': { borderColor: '#444' },
              '&:hover fieldset': { borderColor: '#666' },
            },
          }}
        />

        <TextField
          fullWidth
          label="Job Description"
          variant="outlined"
          margin="normal"
          multiline
          rows={3}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          sx={{
            textarea: { color: '#fff' },
            label: { color: '#ccc' },
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': { borderColor: '#444' },
              '&:hover fieldset': { borderColor: '#666' },
            },
          }}
        />

        <TextField
          fullWidth
          select
          label="Level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          sx={{
            marginTop: '1rem',
            input: { color: '#fff', backgroundColor: '#2a2a2a' },
            label: { color: '#ccc' },
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': { borderColor: '#444' },
              '&:hover fieldset': { borderColor: '#666' },
            },
          }}
        >
          {levels.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: '#444',
              color: '#fff',
              '&:hover': { borderColor: '#666', backgroundColor: '#2a2a2a' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid}
            sx={{
              backgroundColor: isFormValid ? '#333' : '#555',
              color: '#fff',
              '&:hover': { backgroundColor: isFormValid ? '#444' : '#555' },
            }}
          >
            Start Interview
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
AddInterviewModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddInterviewModal;

