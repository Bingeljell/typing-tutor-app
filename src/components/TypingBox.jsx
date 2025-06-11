// src/components/TypingBox.jsx

import { useState, useEffect } from 'react';
import exercises_kids from '../data/exercises_kids';
import exercises_classics from '../data/exercises_classics';
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
  const [currentPart, setCurrentPart] = useState(1);
  const [mode, setMode] = useState('kids'); // 'kids' or 'classics'

  const exercises = mode === 'kids' ? exercises_kids : exercises_classics;
  const partsInCurrentLevel = exercises.filter(ex => ex.level === currentLevel).length;
  const progressPercent = Math.min((currentPart / partsInCurrentLevel) * 100, 100);

  const targetExercise = exercises.find(
    (ex) => ex.level === currentLevel && ex.part === currentPart
  );

  const targetText = targetExercise ? targetExercise.text : '';
  const accuracy = calculateAccuracy(userInput, targetText);
  const sentenceProgressPercent = targetText.length > 0
  ? Math.min((userInput.length / targetText.length) * 100, 100)
  : 0;

  const progressColor = accuracy >= 95
    ? '#4caf50'
    : accuracy >= 75
    ? '#ffeb3b'
    : '#f44336';

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    if (!isComplete && value.length >= targetText.length) {
      setIsComplete(true);
    }

    setUserInput(value);
  };

  useEffect(() => {
    let timer = null;

    if (startTime && !isComplete) {
      timer = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
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

    const maxPart = partsInCurrentLevel;

    if (currentPart < maxPart) {
      setCurrentPart(prev => prev + 1);
    } else {
      const maxLevel = Math.max(...exercises.map(ex => ex.level));
      setCurrentLevel(prevLevel => (prevLevel < maxLevel ? prevLevel + 1 : 1));
      setCurrentPart(1);
    }

    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setExerciseCount(prev => prev + 1);
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '700px',
      margin: '40px auto',
      textAlign: 'center',
      backgroundColor: '#828285',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'
    }}>
      <h2>Typing Practice</h2>

      {/* Mode Switch */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setMode('kids')}
          style={{
            marginRight: '10px',
            fontWeight: mode === 'kids' ? 'bold' : 'normal',
            backgroundColor: mode === 'kids' ? '#9bf013' : '#223306',
            color: mode === 'kids' ? '#000' : '#fff',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Kids Mode
        </button>
        <button onClick={() => setMode('classics')}
          style={{
            marginRight: '10px',
            fontWeight: mode === 'classics' ? 'bold' : 'normal',
            backgroundColor: mode === 'classics' ? '#9bf013' : '#223306',
            color: mode === 'classics' ? '#000' : '#fff',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Classics Mode
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '10px',
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        overflow: 'hidden',
        marginTop: '10px'
      }}>
        <div style={{
          height: '100%',
          width: `${sentenceProgressPercent}%`,
          backgroundColor: progressColor,
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Typing Text */}
      <p
        className="typing-text"
        style={{ fontSize: '24px', letterSpacing: '2px' }}
      >
        {renderText()}
      </p>

      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isComplete}
        style={{
          width: '400px',
          fontSize: '18px',
          marginTop: '10px',
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />

      {/* Stats */}
      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        <p><strong>WPM:</strong> {calculateWPM(userInput, elapsedTime)}</p>
        <p><strong>Accuracy:</strong> {accuracy}%</p>
        <p><strong>Time Elapsed:</strong> {Math.floor(elapsedTime)}s</p>
        <p><strong>Exercises Completed:</strong> {exerciseCount}</p>
        <p><strong>Current Level:</strong> {currentLevel}</p>
        <p><strong>Current Part:</strong> {currentPart} / {partsInCurrentLevel}</p>
        <p><strong>Progress:</strong> {Math.round(progressPercent)}%</p>
      </div>

      {/* Badge */}
      {isComplete && <Badge accuracy={accuracy} />}

      {/* Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleRestart} style={{ marginRight: '10px' }}>
          Restart
        </button>
        <button onClick={handleNextExercise}>Next Exercise</button>
      </div>

      {/* Victory Message + Factoid */}
      {isComplete && (
        <div>
          <div style={{
            fontSize: '32px',
            marginTop: '20px',
            color: 'gold',
            animation: 'pop 0.5s ease-out forwards'
          }}>
            🎉 Exercise Complete!
          </div>
          {targetExercise && targetExercise.factoid && (
            <div style={{
              marginTop: '10px',
              fontStyle: 'italic',
              color: '#555',
              fontSize: '16px'
            }}>
              Fun fact: {targetExercise.factoid}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TypingBox;
