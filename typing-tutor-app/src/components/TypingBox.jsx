// src/components/TypingBox.jsx

import { useState, useEffect } from 'react';
import './TypingBox.css';

const TypingBox = () => {
  const exercises = [
    'hello world this is a typing test',
    'the quick brown fox jumps over the lazy dog',
    'javascript is a fun programming language',
    'practice makes perfect keep going',
    'coding is like solving a puzzle'
  ];

  const [targetText, setTargetText] = useState(
    exercises[Math.floor(Math.random() * exercises.length)]
  );

  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    // Check for completion
    if (value === targetText) {
      setIsComplete(true);
    }

    setUserInput(value);
  };

  // Timer effect
  useEffect(() => {
    let timer = null;

    if (startTime && !isComplete) {
      timer = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000); // in seconds
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [startTime, isComplete]);

  // WPM calculation
  const calculateWPM = () => {
    if (elapsedTime === 0) return 0;
    const wordsTyped = userInput.trim().split(/\s+/).length;
    return Math.round((wordsTyped / elapsedTime) * 60);
  };

  // Accuracy calculation
  const calculateAccuracy = () => {
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) correct++;
    }
    return userInput.length > 0
      ? Math.round((correct / userInput.length) * 100)
      : 100;
  };

  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let color;
      if (index < userInput.length) {
        color = char === userInput[index] ? 'green' : 'red';
      } else {
        color = 'black';
      }

      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  // Restart current exercise
  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
  };

  // Load next exercise
  const handleNextExercise = () => {
    const newText = exercises[Math.floor(Math.random() * exercises.length)];
    setTargetText(newText);
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
  };

  return (
    <div>
      <h2>Typing Practice</h2>
      <p style={{ fontSize: '24px', letterSpacing: '2px' }}>{renderText()}</p>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isComplete}
        style={{ width: '400px', fontSize: '18px', marginTop: '10px' }}
      />
      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        <p><strong>WPM:</strong> {calculateWPM()}</p>
        <p><strong>Accuracy:</strong> {calculateAccuracy()}%</p>
        <p><strong>Time Elapsed:</strong> {Math.floor(elapsedTime)}s</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleRestart} style={{ marginRight: '10px' }}>
          Restart
        </button>
        <button onClick={handleNextExercise}>Next Exercise</button>
      </div>
    </div>
  );
};

export default TypingBox;
