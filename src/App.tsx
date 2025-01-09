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
  Card,
  CardContent,
} from '@mui/material';
import Confetti from 'react-confetti';
import { animated } from 'react-spring';

const App: React.FC = () => {
  const [stage, setStage] = useState<number>(1);
  const [participants, setParticipants] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [selected, setSelected] = useState<string[]>([]);
  const [finalOption, setFinalOption] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [swipedCards, setSwipedCards] = useState<string[]>([]);
  const [approvedCount, setApprovedCount] = useState<number>(0);
  const [dragging, setDragging] = useState(false); // Track dragging state
  const [dragPositions, setDragPositions] = useState<{ [key: number]: { x: number; y: number; isOverList: string | null } }>({}); // Track positions of all cards
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
    setSwipedCards([]);
    setApproved([]); // Reset approved list
    setRejected([]); // Reset rejected list
  };

  const handleSwipe = (direction: string, option: string) => {
    console.log('direction ', direction)
    if (direction === 'right') {
      setApprovedCount((prev) => prev + 1);
      setApproved((prev) => [...prev, option]); // Add to approved list
    } else if (direction === 'left') {
      setRejected((prev) => [...prev, option]); // Add to rejected list
    }

    setSwipedCards((prev) => [...prev, option]);

    console.log('approved count: ', approvedCount + 1);
    if (approvedCount + 1 === 2) {
      setStage(4); // Move to stage 4 after 2 approved swipes
    }
  };

  const cardProps = (
    option: string,
    index: number,
    dragPositions: { [key: number]: { x: number; y: number; isOverList: string | null } },
    setDragPositions: React.Dispatch<React.SetStateAction<{ [key: number]: { x: number; y: number; isOverList: string | null } }>>,
    dragging: boolean,
    setDragging: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
      setDragging(true); // Start dragging
      event.preventDefault(); // Prevent default behavior (e.g., text selection)
    };
  
    const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
      if (!dragging) return;
  
      let x: number;
      let y: number;
  
      // Determine the X, Y coordinates based on the event type
      if (event.type === "mousedown" || event.type === "mousemove") {
        x = (event as React.MouseEvent).clientX;
        y = (event as React.MouseEvent).clientY;
      } else if (event.type === "touchstart" || event.type === "touchmove") {
        x = (event as React.TouchEvent).touches[0].clientX;
        y = (event as React.TouchEvent).touches[0].clientY;
      } else {
        return;
      }
  
      // Determine if the card is over a list (left or right)
      const isOverList = (x < window.innerWidth / 2) ? 'left' : (x > window.innerWidth / 2) ? 'right' : null;
  
      setDragPositions((prevPositions) => ({
        ...prevPositions,
        [index]: { x: x - window.innerWidth / 2, y: y - window.innerHeight / 2, isOverList }, // Adjust Y by subtracting screen height
      }));
    };
  
    const handleDragEnd = () => {
      setDragging(false); // Stop dragging
      const currentDragPosition = dragPositions[index];
  
      if (currentDragPosition?.isOverList === 'right') {
        handleSwipe('right', option); // Swipe right (Approved)
      } else if (currentDragPosition?.isOverList === 'left') {
        handleSwipe('left', option); // Swipe left (Rejected)
      } else {
        setDragPositions((prevPositions) => ({
          ...prevPositions,
          [index]: { x: 0, y: 0, isOverList: null }, // Reset position and list tracking
        }));
      }
    };

    console.log('dragging? ', dragging)
  
    return {
      onMouseDown: handleDragStart,
      onTouchStart: handleDragStart,
      onMouseMove: handleDrag,
      onTouchMove: handleDrag,
      onMouseUp: handleDragEnd,
      // onTouchEnd: handleDragEnd,
      // onMouseLeave: handleDragEnd,
      style: {
        transform: `translateX(${dragPositions[index]?.x || 0}px) rotate(${dragPositions[index]?.x / 10}deg)`,
        opacity: 1,
        cursor: dragging ? 'grabbing' : 'grab',
      },
    };
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

        {/* Stage 3 - Drag cards */}
        {stage === 3 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Select Two Options
            </Typography>
            <Container>
              <Box style={{ position: 'relative' }}>
                {options.map((option, index) => {
                  if (!swipedCards.includes(option)) {
                    return (
                      <animated.div key={index} {...cardProps(option, index, dragPositions, setDragPositions, dragging, setDragging)}>
                        <Card style={{ marginBottom: '10px', position: 'absolute', width: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" align="center">
                              {option[0]}
                            </Typography>
                          </CardContent>
                        </Card>
                      </animated.div>
                    );
                  }
                  return null;
                })}
              </Box>
            </Container>
          </>
        )}

        {/* Stage 4 - Select one option */}
        {stage === 4 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Select One Option
            </Typography>
            <Typography variant="h5" align="center" gutterBottom>
              {finalOption ? finalOption : 'Waiting for selection...'}
            </Typography>
          </>
        )}

        {participants.length > 0 && (
          <>
            <Box
              style={{
                position: 'fixed',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
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
      {/* Approved and Rejected lists side by side */}
      {(stage === 4 || stage === 3) && (
        <Box display="flex" justifyContent="space-between" marginTop="2rem" style={{ width: '100%' }}>
          <Box
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
            zIndex={1} // Ensure it appears on top of other elements if needed
          >
            <Typography variant="h6" gutterBottom color={darkMode ? "lightgreen" : "darkgreen"}>Approved</Typography>
            <ul>
              {approved.map((card, index) => (
                <li key={index}>{card}</li>
              ))}
            </ul>
          </Box>

          <Box
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
            zIndex={1} // Ensure it appears on top of other elements if needed
          >
            <Typography variant="h6" gutterBottom color={darkMode ? "lightcoral" : "darkred"}>Rejected</Typography>
            <ul>
              {rejected.map((card, index) => (
                <li key={index}>{card}</li>
              ))}
            </ul>
          </Box>
        </Box>
      )}

    </ThemeProvider>
  );
};

export default App;
