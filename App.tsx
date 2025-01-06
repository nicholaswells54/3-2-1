import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';
import Confetti from 'react-confetti';

const App: React.FC = () => {
  const [stage, setStage] = useState<number>(1);
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [selected, setSelected] = useState<string[]>([]);
  const [finalOption, setFinalOption] = useState<string | null>(null);

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
    if (stage === 1) {
      setStage(2);
    } else if (stage === 2 && selected.length === 2) {
      setStage(3);
    } else if (stage === 3 && selected.length === 1) {
      setFinalOption(selected[0]);
      setStage(4);
    }
  };

  const handleReset = (): void => {
    setStage(1);
    setOptions(["", "", ""]);
    setSelected([]);
    setFinalOption(null);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      {stage === 4 && <Confetti />} {/* Show confetti when the final option is displayed */}
      <Typography variant="h4" gutterBottom>
        Option Selector
      </Typography>

      {stage === 1 && (
        <>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={options.some((option) => option.trim() === "")}
          >
            Submit Options
          </Button>
        </>
      )}

      {stage === 2 && (
        <>
          <Typography variant="h6">Select Two Options</Typography>
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

      {stage === 3 && (
        <>
          <Typography variant="h6">Select One Option</Typography>
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

      {stage === 4 && (
        <>
          <Typography variant="h5" gutterBottom>
            The final option is: {finalOption}!
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </>
      )}
    </Container>
  );
};

export default App;
