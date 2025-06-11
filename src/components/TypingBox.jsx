// src/components/TypingBox.jsx

import { useState, useEffect } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/typingUtils';
import './TypingBox.css';
import Badge from './Badge';
import kidsExercises from '../data/exercises_kids';
import classicsExercises from '../data/exercises_classics';


const TypingBox = () => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentPart, setCurrentPart] = useState(1);

  const [mode, setMode] = useState('kids'); // 'kids' or 'classics'
  const exercises = mode === 'kids' ? kidsExercises : classicsExercises;



  const targetExercise = exercises.find(
    (ex) => ex.level === currentLevel && ex.part === currentPart);
  const targetText = targetExercise ? targetExercise.text : '';
  

  const accuracy = calculateAccuracy(userInput, targetText);

  const progressColor = accuracy >= 95
    ? '#4caf50'   // Green
    : accuracy >= 75
    ? '#ffeb3b'   // Yellow
    : '#f44336';  // Red

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
  
    const maxPart = Math.max(...exercises
      .filter(ex => ex.level === currentLevel)
      .map(ex => ex.part));
  
    if (currentPart < maxPart) {
      setCurrentPart(prev => prev + 1);
    } else {
      // Move to next level
      setCurrentLevel((prev) => (prev < exercises.length ? prev + 1 : 1));
      setCurrentPart(1); // Reset part
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
      maxWidth: '600px',
      margin: '40px auto',
      textAlign: 'center',
      backgroundColor: 'rgba(197, 197, 197, 0.7)',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'  // fun for kids; can switch in themes later
    }}>
      <h2>Typing Practice</h2>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setMode('kids')} 
        style={{
          marginRight: '10px',
          fontWeight: mode === 'kids' ? 'bold' : 'normal',
          backgroundColor: mode === 'kids' ? '#9bf013' : '#223306'
           }}>
          Kids Mode
        </button>
        <button onClick={() => setMode('classics')} 
        style={{
          marginRight: '10px',
          fontWeight: mode === 'classics' ? 'bold' : 'normal',
          backgroundColor: mode === 'classics' ? '#9bf013' : '#223306'
           }}>
          Classics Mode
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
            height: '20px',
            width: '100%',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden',
            marginTop: '20px'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min((userInput.length / targetText.length) * 100, 100)}%`,
              
              backgroundColor: progressColor,
              transition: 'width 0.3s ease'
            }} />
          </div>
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
        <p><strong>Current Part:</strong> {currentPart}</p> 
        

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
      {isComplete && targetExercise && targetExercise.factoid && (
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
  );
};

export default TypingBox;
