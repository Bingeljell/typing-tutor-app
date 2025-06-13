// src/components/TypingBox.jsx

import { useState, useEffect, useRef } from 'react';
import exercises_classics from '../data/exercises_classics';
import exercises_pop from '../data/exercises_pop';
import exercises_news from '../data/exercises_news';
import exercises_stem from '../data/exercises_stem';
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
  //const [mode, setMode] = useState('kids'); // 'kids' or 'classics'
  const [category, setCategory] = useState('classics');


  const exercises = {
    classic: exercises_classics,
    pop: exercises_pop,
    news: exercises_news,
    stem: exercises_stem
  }[category] || [];
  
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


  const [fadeOutFactoid, setFadeOutFactoid] = useState(false);
  
  const inputRef = useRef();


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

  useEffect(() => {
    if (!isComplete) {
      inputRef.current?.focus();
    }
  }, [currentPart, currentLevel, isComplete]);


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
    // Trigger fade-out first
    setFadeOutFactoid(true);
  
    // Wait 500ms → then run your original logic:
    setTimeout(() => {
      const maxPart = partsInCurrentLevel;
  
      if (currentPart < maxPart) {
        setCurrentPart(prev => prev + 1);
      } else {
        const maxLevel = Math.max(...exercises.map(ex => ex.level));
        setCurrentLevel(prevLevel => (prevLevel < maxLevel ? prevLevel + 1 : 1));
        setCurrentPart(1);
      }
  
      // Reset typing box states
      setUserInput('');
      setStartTime(null);
      setElapsedTime(0);
      setIsComplete(false);
      setExerciseCount(prev => prev + 1);
  
      // Reset fadeOut state so next factoid animates in fresh
      setFadeOutFactoid(false);
    }, 500); // match fadeOut animation duration
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && isComplete) {
        handleNextExercise();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isComplete, handleNextExercise]);
    
  return (
    
    <div className="typing-box-container">
      <h2 className="typing-box-title">Culture yourself as you learn to type</h2>
      <p className="instructions">Select a mode below to get started</p>

      {/* Mode Switch */}
      <button onClick={() => setCategory('classic')} className={`mode-button ${category === 'classic' ? 'classic-mode' : ''}`}>
        Classics
      </button>
      <button onClick={() => setCategory('pop')} className={`mode-button ${category === 'pop' ? 'pop-mode' : ''}`}>
        Pop Culture
      </button>
      <button onClick={() => setCategory('news')} className={`mode-button ${category === 'news' ? 'news-mode' : ''}`}>
        News
      </button>
      <button onClick={() => setCategory('stem')} className={`mode-button ${category === 'stem' ? 'stem-mode' : ''}`}>
        STEM
      </button>


      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${sentenceProgressPercent}%` }}
        />
      </div>

      {/* Typing Text */}
      <p className="typing-text-box">
        {renderText()}
      </p>
      {/* Factoid */}
      {isComplete && targetExercise && targetExercise.factoid && (
        <div
        className={`factoid-box ${category}-mode`}
        style={{
          animation: fadeOutFactoid
            ? 'fadeOut 0.5s ease-out forwards'
            : 'fadeSlideIn 0.6s ease-out forwards, pulse 2s ease-in-out 0.8s 3'
        }}
      >
        🌟 Fun Fact: {targetExercise.factoid}
      </div>
      )}
      <input
        className="typing-input"
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isComplete}
        
      />

      {/* Stats */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '5px',
        marginTop: '40px',
        fontFamily: 'Inter'
      }}>
        {[
          { label: 'WPM', value: calculateWPM(userInput, elapsedTime) },
          { label: 'Accuracy', value: `${accuracy}%` },
          { label: 'Time Elapsed', value: `${Math.floor(elapsedTime)}s` },
          { label: 'Exercises Completed', value: exerciseCount },
          { label: 'Level', value: currentLevel },
          { label: 'Part', value: `${currentPart} / ${partsInCurrentLevel}` },
          { label: 'Progress', value: `${Math.round(progressPercent)}%` }
        ].map((stat, index) => (
          <div key={index} className="stats-box">
            <div style={{ fontSize: '14px', color: '#666' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Badge */}
      {isComplete && <Badge accuracy={accuracy} />}

      {/* Buttons */}
      <div style={{ marginTop: '20px' }}>
      <button onClick={handleRestart} className="general-button">
        Restart
      </button>
      <button
        onClick={handleNextExercise}
        disabled={!isComplete}
        className="general-button"
        style={{
          opacity: isComplete ? 1 : 0.5,
          cursor: isComplete ? 'pointer' : 'not-allowed'
        }}
      >
        Next Exercise
      </button>
      </div>

      {/* Victory Message */}
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
        </div>
      )}
    </div>
  );
};

export default TypingBox;
