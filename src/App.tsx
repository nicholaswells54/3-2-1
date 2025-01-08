import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  Switch,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import Confetti from 'react-confetti';
import { borders, Theme } from '@mui/system';

const App: React.FC = () => {
  const [stage, setStage] = useState<number>(1);
  const [participants, setParticipants] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [selected, setSelected] = useState<string[]>([]);
  const [finalOption, setFinalOption] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);

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

  const handleSelectionChange = (option: string): void => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else if (selected.length < 2 || stage === 3) {
      setSelected([...selected, option]);
    }
  };

  const handleSubmit = (): void => {
    if (stage === 2 && options.every((option) => option.trim() !== "")) {
      setStage(3);
    } else if (stage === 3 && selected.length === 2) {
      setStage(4);
    } else if (stage === 4 && selected.length === 1) {
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

        {stage === 5 && <Confetti />} {/* Show confetti when the final option is displayed */}

        <Typography variant="h4" align="center" gutterBottom>
          Let's Play 3-2-1!
        </Typography>

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

        {stage === 3 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Select Two Options
            </Typography>
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selected.includes(option)}
                    onChange={() => handleSelectionChange(option)}
                  />
                }
                label={option}
              />
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selected.length !== 2}
            >
              Submit Selection
            </Button>
          </>
        )}

        {stage === 4 && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Select One Option
            </Typography>
            {selected.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selected.includes(option)}
                    onChange={() => handleSelectionChange(option)}
                  />
                }
                label={option}
              />
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selected.length !== 1}
            >
              Submit Final Selection
            </Button>
          </>
        )}

        {stage === 5 && (
          <>
            <Typography variant="h5" align="center" gutterBottom>
              The final option is: {finalOption}!
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
                border: darkMode ? '2px solid white' : '2px solid black', // border based on dark mode
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
          {stage !== 1 && (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;

