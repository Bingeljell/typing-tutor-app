// src/components/TypingBox.jsx

import { useState, useEffect } from 'react';
import exercises from '../data/exercises';
import { calculateWPM, calculateAccuracy } from '../utils/typingUtils';
import './TypingBox.css';
import Badge from './Badge';

const TypingBox = () => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

  const targetExercise = exercises.find((ex) => ex.level === currentLevel);
  const targetText = targetExercise ? targetExercise.text : '';

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    // Check for completion → safe pattern
    if (!isComplete && value.length >= targetText.length) {
      setIsComplete(true);
    }

    setUserInput(value);
  };

  // Timer effect
  useEffect(() => {
    let timer = null;
    console.log('isComplete changed:', isComplete);

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

  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
  };

  const handleNextExercise = () => {
    console.log('Next exercise clicked');
    setCurrentLevel((prev) => (prev < exercises.length ? prev + 1 : 1));
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setExerciseCount((prev) => prev + 1);
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
        <p><strong>Exercises Completed:</strong> {exerciseCount}</p>
        <p><strong>Current Level:</strong> {currentLevel}</p>
      </div>

      {/* Badge → correct prop usage */}
      {isComplete && <Badge accuracy={calculateAccuracy(userInput, targetText)} />}

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
            animation: 'pop 0.5s ease-out forwards',
          }}
        >
          🎉 Exercise Complete!
        </div>
      )}
    </div>
  );
};

export default TypingBox;
