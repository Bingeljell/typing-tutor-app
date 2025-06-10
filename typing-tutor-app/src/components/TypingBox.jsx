// src/components/TypingBox.jsx

import { useState, useEffect } from 'react';
import exercises from '../data/exercises';
import { calculateWPM, calculateAccuracy } from '../utils/typingutils';
import './TypingBox.css';

const TypingBox = () => {

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
    if (value.length >= targetText.length) {
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

  
  const renderText = () => {
    return targetText.split('').map((char, index) => {
        let className = '';
        if (index < userInput.length) {
          className = char === userInput[index] ? 'correct' : 'incorrect';
        }
      
        return (
          <span key={index} className={className}>
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
        <p><strong>WPM:</strong> {calculateWPM(userInput, elapsedTime)}</p>
        <p><strong>Accuracy:</strong> {calculateAccuracy(userInput, targetText)}%</p>
        <p><strong>Time Elapsed:</strong> {Math.floor(elapsedTime)}s</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleRestart} style={{ marginRight: '10px' }}>
          Restart
        </button>
        <button onClick={handleNextExercise}>Next Exercise</button>
      </div>
      {isComplete && (
      <div
        style={{
          fontSize: '32px',
          marginTop: '20px',
          color: 'gold',
          animation: 'pop 0.5s ease-out forwards'
        }}
      >
        🎉 Exercise Complete!
      </div>
    )}
    </div>
  );
};

export default TypingBox;
