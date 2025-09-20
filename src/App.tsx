// App.tsx
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
import { useSpring, animated } from '@react-spring/web';
import Stage1 from './Stage1.tsx';
import Stage2 from './Stage2.tsx';
import Stage3 from './Stage3.tsx';
import Stage4 from './Stage4.tsx';
import Stage5 from './Stage5.tsx';
import SteamProfile from './SteamProfile.tsx';


const App: React.FC = () => {
  const [stage, setStage] = useState<number>(0);
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

  // Define transition for stages
  const startPageTransition = useSpring({
    opacity: stage === 0 ? 1 : 0,
    transform: stage === 0 ? 'translateY(0)' : 'translateY(100%)',
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

  const handleOptionApproved = (option: string) => {
    setApproved((prev) => [...prev, option]);
    setApprovedCount((prev) => prev + 1);
    setOptions((prev) => prev.filter((opt) => opt !== option));
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
    setStage(0);
    setParticipants([]);
    setOptions(["", "", ""]);
    setSelected([]);
    setFinalOption(null);
    setApprovedCount(0);
    setApproved([]); // Reset approved list
    setRejected([]); // Reset rejected list
  };

  const handleCustomClick = () => {
    setStage(1); // Go to stage 1
  };

  const handleSteamClick = () => {
    setStage(-2); // Show Steam Profile page
  };

  // Define transition animations
  const stageTransition = useSpring({
    opacity: stage === 1 ? 1 : 0,
    transform: stage === 1 ? 'translateY(0)' : 'translateY(100%)',
  });

  const optionsTransition = useSpring({
    opacity: stage === 2 ? 1 : 0,
    transform: stage === 2 ? 'translateY(0)' : 'translateY(100%)',
  });

  const draggableTransition = useSpring({
    opacity: stage === 3 || stage === 4 ? 1 : 0,
    transform: stage === 3 || stage === 4 ? 'translateY(0)' : 'translateY(100%)',
  });

  const finalSelectionTransition = useSpring({
    opacity: stage === 5 ? 1 : 0,
    transform: stage === 5 ? 'translateY(0)' : 'translateY(50%)',
  });

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

        <Typography variant="h4" align="center" gutterBottom>
          3-2-1
        </Typography>

        {/* Start Page with buttons */}
        <animated.div style={startPageTransition}>
          {stage === 0 && (
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Welcome to the 3-2-1 Game!
              </Typography>
              <Button variant="contained" color="primary" onClick={handleCustomClick} style={{ margin: '10px' }}>
                Custom
              </Button>
              <Button variant="contained" color="secondary" onClick={handleSteamClick} style={{ margin: '10px' }}>
                Steam
              </Button>
            </Box>
          )}
        </animated.div>

        {/* Work in Progress message */}
        {stage === -1 && (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              Work in Progress
            </Typography>
          </Box>
        )}

        {/* Steam Profile Component */}
        {stage === -2 && (
          <SteamProfile 
            darkMode={darkMode} 
            onBack={handleReset}
          />
        )}

        {/* Stage 1 - Participants */}
        <animated.div style={stageTransition}>
          {stage === 1 && <Stage1 onSubmit={handleParticipantsSubmit} />}
        </animated.div>

        {/* Stage 2 - Options */}
        <animated.div style={optionsTransition}>
          {stage === 2 && (
            <Stage2
              options={options}
              onOptionChange={handleOptionChange}
              onSubmit={handleSubmit}
            />
          )}
        </animated.div>


        {/* Stage 3 - Draggable options */}
        <animated.div style={draggableTransition}>
          {stage === 3 && <Stage3 options={options} darkMode={darkMode} onOptionApproved={handleOptionApproved} />}
        </animated.div>

        {/* Stage 4 - Draggable options */}
        <animated.div style={draggableTransition}>
          {stage === 4 && <Stage4 options={options} darkMode={darkMode} onOptionApproved={handleOptionApproved} />}
        </animated.div>


        {/* Final Selection */}
        <animated.div style={finalSelectionTransition}>
        {stage === 5 && (
            <Stage5
              finalOption={finalOption}
              darkMode={darkMode}
              onReset={handleReset}
            />
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
              <Box display="flex" flexDirection="column" alignItems="center">
                {approved.map((item, index) => (
                  <Box
                    key={index}
                    style={{
                      border: '2px solid',
                      borderRadius: '12px',  // Rounded corners
                      padding: '10px',
                      marginBottom: '10px',
                      width: '80%',
                      textAlign: 'center',
                      backgroundColor: darkMode ? '#444' : '#ddd',
                    }}
                  >
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                ))}
              </Box>
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
              <Box display="flex" flexDirection="column" alignItems="center">
                {rejected.map((item, index) => (
                  <Box
                    key={index}
                    style={{
                      border: '2px solid',
                      borderRadius: '12px',  // Rounded corners
                      padding: '10px',
                      marginBottom: '10px',
                      width: '80%',
                      textAlign: 'center',
                      backgroundColor: darkMode ? '#444' : '#ddd',
                    }}
                  >
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}


        {participants.length > 0 && stage !== -2 && (
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
                {participants[currentIndex] || participants[0]}
              </Typography>
            </Box>
          </>
        )}

        {/* Fixed position buttons */}
        {stage !== -2 && (
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
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
