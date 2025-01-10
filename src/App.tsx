import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Box,
  Switch,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import Confetti from 'react-confetti';

const App: React.FC = () => {
  const [stage, setStage] = useState<number>(1);
  const [participants, setParticipants] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [selected, setSelected] = useState<string[]>([]);
  const [finalOption, setFinalOption] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [approvedCount, setApprovedCount] = useState<number>(0);
  const [approved, setApproved] = useState<string[]>([]); // Track approved cards
  const [rejected, setRejected] = useState<string[]>([]); // Track rejected cards

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#000',
          },
        },
      },
    },
  });

  const handleParticipantsSubmit = (input: string): void => {
    const participantList = input
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name !== '')
      .sort(() => Math.random() - 0.5);
    setParticipants(participantList);
    setStage(2);
  };

  const handleOptionChange = (index: number, value: string): void => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (): void => {
    if (stage === 2 && options.every((option) => option.trim() !== "")) {
      setStage(3);
    } else if (stage === 3 && approvedCount === 2) {
      setStage(4);
    } else if (stage === 4 && approvedCount === 1) {
      setFinalOption(selected[0]);
      setStage(5);
    }
  };

  const handleParticipantChange = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % participants.length);
  };

  const handleReset = (): void => {
    setStage(1);
    setParticipants([]);
    setOptions(["", "", ""]);
    setSelected([]);
    setFinalOption(null);
    setApprovedCount(0);
    setApproved([]); // Reset approved list
    setRejected([]); // Reset rejected list
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" style={{ marginTop: '2rem', position: 'relative', paddingBottom: '120px' }}>
        <Box display="flex" justifyContent="flex-end" marginBottom="1rem">
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label={darkMode ? "Dark Mode" : "Light Mode"}
          />
        </Box>

        {stage === 5 && <Confetti />}

        <Typography variant="h4" align="center" gutterBottom>
          Let's Play 3-2-1!
        </Typography>

        {/* Stage 1 - Participants */}
        {stage === 1 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Who's playing?
            </Typography>
            <TextField
              label="Enter participants (comma-separated)"
              fullWidth
              margin="normal"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleParticipantsSubmit((e.target as HTMLInputElement).value);
                }
              }}
            />
            <Box display="flex" justifyContent="space-between" marginTop="1rem">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  const inputField = document.querySelector(
                    'input[type=text]'
                  ) as HTMLInputElement;
                  if (inputField) handleParticipantsSubmit(inputField.value);
                }}
              >
                Submit Participants
              </Button>
            </Box>
          </>
        )}

        {/* Stage 2 - Options */}
        {stage === 2 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Enter Options
            </Typography>
            {options.map((option, index) => (
              <TextField
                key={index}
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                fullWidth
                margin="normal"
              />
            ))}
            <Box display="flex" justifyContent="space-between" marginTop="1rem">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={options.some((option) => option.trim() === "")}
              >
                Submit Options
              </Button>
            </Box>
          </>
        )}

        {/* Stage 3 - User drags top option (options[0]) to the approved or rejected side, option populates that list and moves to the last position in the index, moves to stage 4 once 2 options are approved*/}
        {stage === 3 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Approve two selections by dragging option to the right of the screen
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
                }}
              >
                {options[0]}
              </div>
            </Box>
          </>
        )}

        {/* Stage 4 - Take the 2 approved options from the previous stage, User drags top option (options[0]) to the approved or rejected side, option populates that list and moves to the last position in the index, moves to stage 5 when one option is approved.*/}
        {stage === 4 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Approve one selection by dragging option to the right of the screen
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
                }}
              >
                {options[0]}
              </div>
            </Box>
          </>
        )}

        {/* Drop zones for Approved and Rejected lists */}
        {(stage === 3 || stage === 4) && (
        // Approved List
        <Box display="flex" justifyContent="space-between" marginTop="2rem">
          <Box
            onDrop={(e) => {
              e.preventDefault();
              const draggedOption = e.dataTransfer.getData("text");
              setApproved((prev) => [...prev, draggedOption]);
              setOptions((prev) => {
                const newOptions = prev.filter((option) => option !== draggedOption);
                return [...newOptions, draggedOption];
              });
              setApprovedCount(approvedCount + 1);
            }}
            onDragOver={(e) => e.preventDefault()}
            border={1}
            padding="1rem"
            borderRadius="8px"
            width="33.33%" // Set to 1/3 of the screen width
            height="100vh" // Make sure the box takes full height of the screen
            borderColor={darkMode ? "lightgreen" : "darkgreen"}
            bgcolor={darkMode ? "rgba(144, 238, 144, 0.2)" : "rgba(0, 128, 0, 0.1)"} // Light green for dark mode
            position="fixed" // Fix the box on the screen
            right="0" // Align to the left edge of the screen
            top="0" // Align to the top of the screen
          >
            <Typography variant="h6" gutterBottom>
              Approved
            </Typography>
            <ul>
              {approved.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Box>

          {/* Rejected List */}
          <Box
            onDrop={(e) => {
              e.preventDefault();
              const draggedOption = e.dataTransfer.getData("text");
              setRejected((prev) => [...prev, draggedOption]);
              setOptions((prev) => {
                const newOptions = prev.filter((option) => option !== draggedOption);
                return [...newOptions, draggedOption];
              });
            }}
            onDragOver={(e) => e.preventDefault()}
            border={1}
            padding="1rem"
            borderRadius="8px"
            width="33.33%" // Set to 1/3 of the screen width
            height="100vh" // Make sure the box takes full height of the screen
            borderColor={darkMode ? "lightcoral" : "darkred"}
            bgcolor={darkMode ? "rgba(255, 99, 71, 0.2)" : "rgba(139, 0, 0, 0.1)"} // Light red for dark mode
            position="fixed" // Fix the box on the screen
            left="0" // Align to the right edge of the screen
            top="0" // Align to the top of the screen
          >
            <Typography variant="h6" gutterBottom>
              Rejected
            </Typography>
            <ul>
              {rejected.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Box>
        </Box>
        )}

        {participants.length > 0 && (
          <>
            <Box
              style={{
                position: 'fixed',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 0,
                textAlign: 'center',
                border: darkMode ? '2px solid white' : '2px solid black',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Who's up?
              </Typography>
              <Typography variant="h4" gutterBottom>
                {participants[currentIndex]}
              </Typography>
            </Box>
          </>
        )}

        {/* Fixed position buttons */}
        <Box
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            gap: '10px',
          }}
        >
          <Button variant="outlined" color="secondary" onClick={handleParticipantChange}>
            Next Participant
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
