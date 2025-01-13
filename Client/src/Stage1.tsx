// Stage1.tsx
import React, { useState } from 'react';
import { Typography, TextField, Box, Button } from '@mui/material';

interface Stage1Props {
  onSubmit: (input: string) => void;
}

const Stage1: React.FC<Stage1Props> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      onSubmit(input);
    }
  };

  const handleButtonClick = (): void => {
    onSubmit(input);
  };

  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Who's playing?
      </Typography>
      <TextField
        label="Enter participants (comma-separated)"
        fullWidth
        margin="normal"
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <Box display="flex" justifyContent="space-between" marginTop="1rem">
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Submit Participants
        </Button>
      </Box>
    </>
  );
};

export default Stage1;