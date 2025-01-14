// Stage5.tsx
import React from 'react';
import Confetti from 'react-confetti';
import { Box, Typography, Button, Modal } from '@mui/material';

interface Stage5Props {
  finalOption: string | null;
  darkMode: boolean;
  onReset: () => void;
}

const Stage5: React.FC<Stage5Props> = ({ finalOption, darkMode, onReset }) => {
  return (
    <Modal
      open={true}
      onClose={() => {}}
      aria-labelledby="final-selection-title"
      aria-describedby="final-selection-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          backgroundColor: darkMode ? '#444' : '#fff',
          color: darkMode ? '#fff' : '#000',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Confetti />
        <Typography id="final-selection-title" variant="h4" gutterBottom>
          Final Selection
        </Typography>
        <Typography
          id="final-selection-description"
          variant="h5"
          style={{ fontWeight: 'bold' }}
        >
          {finalOption}
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onReset}
          style={{ marginTop: '1rem' }}
        >
          Reset
        </Button>
      </Box>
    </Modal>
  );
};

export default Stage5;
