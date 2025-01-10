import React, { useState, useEffect } from 'react';
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
  Modal
} from '@mui/material';
import Confetti from 'react-confetti';
import { useSpring, animated } from '@react-spring/web';

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
  const [showStageChange, setShowStageChange] = useState(false);

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

  // Show the "Stage Change" message whenever the stage changes
  useEffect(() => {
    setShowStageChange(true);
    const timer = setTimeout(() => {
      setShowStageChange(false);
    }, 2000); // Hide the message after 2 seconds

    return () => clearTimeout(timer);
  }, [stage]);

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

  // Define transition animations
  const stageTransition = useSpring({
    opacity: stage === 1 ? 1 : 0,
    transform: stage === 1 ? 'translateX(0)' : 'translateX(100%)',
  });

  const optionsTransition = useSpring({
    opacity: stage === 2 ? 1 : 0,
    transform: stage === 2 ? 'translateX(0)' : 'translateX(100%)',
  });

  const draggableTransition = useSpring({
    opacity: stage === 3 || stage === 4 ? 1 : 0,
    transform: stage === 3 || stage === 4 ? 'translateX(0)' : 'translateX(100%)',
  });

  const finalSelectionTransition = useSpring({
    opacity: stage === 5 ? 1 : 0,
    transform: stage === 5 ? 'translateY(0)' : 'translateY(50%)',
  });

  const stageChangeTransition = useSpring({
    opacity: showStageChange ? 1 : 0,
    transform: showStageChange ? 'translateY(0)' : 'translateY(-50%)',
    config: { duration: 2000 }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" style={{ marginTop: '2rem', position: 'relative', paddingBottom: '120px' }}>
        {/* Stage Change Message */}
        <animated.div style={{ ...stageChangeTransition, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
          <Typography variant="h3" color="primary">
            Stage Change
          </Typography>
        </animated.div>

        <Box display="flex" justifyContent="flex-end" marginBottom="1rem">
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label={darkMode ? "Dark Mode" : "Light Mode"}
          />
        </Box>

        {stage === 5 && (
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
              <Button variant="outlined" color="secondary" onClick={handleReset} style={{ marginTop: '1rem' }}>
                Reset
              </Button>
            </Box>
          </Modal>
        )}

        <Typography variant="h4" align="center" gutterBottom>
          3-2-1
        </Typography>

        {/* Stage 1 - Participants */}
        <animated.div style={stageTransition}>
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
        </animated.div>

        {/* Stage 2 - Options */}
        <animated.div style={optionsTransition}>
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
        </animated.div>

        {/* Stage 3 - Draggable options */}
        <animated.div style={draggableTransition}>
          {stage === 3 && (
            <>
              <Typography variant="h6" align="center" gutterBottom>
                Approve two selections by dragging an option to the right of the screen.
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
                    width: '100%',
                  }}
                >
                  {options[0]}
                </div>
              </Box>
            </>
          )}
        </animated.div>

        {/* Stage 4 - Draggable options */}
        <animated.div style={draggableTransition}>
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
                    width: '100%',
                  }}
                >
                  {options[0]}
                </div>
              </Box>
            </>
          )}
        </animated.div>

        {/* Final Selection */}
        <animated.div style={finalSelectionTransition}>
          {stage === 5 && (
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
                <Button variant="outlined" color="secondary" onClick={handleReset} style={{ marginTop: '1rem' }}>
                  Reset
                </Button>
              </Box>
            </Modal>
          )}
        </animated.div>


        {/* Drop zones for Approved and Rejected lists */}
        {(stage === 3 || stage === 4) && (
          <Box display="flex" justifyContent="space-between" marginTop="2rem">
            {/* Approved List */}
            <Box
              onDrop={(e) => {
                e.preventDefault();
                const draggedOption = e.dataTransfer.getData("text");
                if (!approved.includes(draggedOption)) {
                  setApproved((prev) => [...prev, draggedOption]);
                  setApprovedCount((prev) => {
                    const newCount = prev + 1;

                    if (stage === 3 && newCount === 2) {
                      setStage(4);
                      setOptions([...approved, draggedOption]);
                      setApproved([]);
                      setRejected([]);
                      return 0;
                    }

                    if (stage === 4 && newCount === 1) {
                      setFinalOption(draggedOption);
                      setStage(5);
                      return 0;
                    }

                    return newCount;
                  });
                }
                setOptions((prev) => prev.filter((option) => option !== draggedOption));
              }}
              onDragOver={(e) => e.preventDefault()}
              border={1}
              padding="1rem"
              borderRadius="0" // Sharp corners
              width="33.33%"
              height="100vh"
              borderColor={darkMode ? "lightgreen" : "darkgreen"}
              bgcolor={darkMode ? "rgba(144, 238, 144, 0.2)" : "rgba(0, 128, 0, 0.1)"}
              position="fixed"
              right="0"
              top="0"
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
                if (!rejected.includes(draggedOption)) {
                  setRejected((prev) => [...prev, draggedOption]);
                }
                setOptions((prev) => {
                  const updatedOptions = prev.filter((option) => option !== draggedOption);
                  return [...updatedOptions, draggedOption];
                });
              }}
              onDragOver={(e) => e.preventDefault()}
              border={1}
              padding="1rem"
              borderRadius="0" // Sharp corners
              width="33.33%"
              height="100vh"
              borderColor={darkMode ? "lightcoral" : "darkred"}
              bgcolor={darkMode ? "rgba(255, 99, 71, 0.2)" : "rgba(139, 0, 0, 0.1)"}
              position="fixed"
              left="0"
              top="0"
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
