// Stage2.tsx
import React from 'react';
import { TextField, Typography, Box, Button } from '@mui/material';

interface Stage2Props {
  options: string[];
  onOptionChange: (index: number, value: string) => void;
  onSubmit: () => void;
}

const Stage2: React.FC<Stage2Props> = ({ options, onOptionChange, onSubmit }) => {
  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Enter Options
      </Typography>
      {options.map((option, index) => (
        <TextField
          key={index}
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) => onOptionChange(index, e.target.value)}
          fullWidth
          margin="normal"
        />
      ))}
      <Box display="flex" justifyContent="space-between" marginTop="1rem">
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={options.some((option) => option.trim() === "")}
        >
          Submit Options
        </Button>
      </Box>
    </>
  );
};

export default Stage2;
