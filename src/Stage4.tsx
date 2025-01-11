// Stage4.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface Stage4Props {
  options: string[];
  darkMode: boolean;
  onOptionApproved: (option: string) => void;
}

const Stage4: React.FC<Stage4Props> = ({ options, darkMode, onOptionApproved }) => {
  return (
    <>
        <Typography variant="h6" align="center" gutterBottom>
            Approve one selections by dragging an option to the right of the screen.    
        </Typography>
        <Box display="flex" justifyContent="center" marginTop="2rem">
            <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text", options[0])}
                style={{
                padding: "1rem",
                border: "1px solid",
                borderRadius: "8px",
                cursor: "grab",
                backgroundColor: darkMode ? "#444" : "#ddd",
                width: '175px', // Playing card width
                height: '245px', // Playing card height
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                }}
            >
                {options[0]}
            </div>
        </Box>
    </>
  );
};

export default Stage4;
