import React, { useEffect, useRef, useState } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import classic from '../data/exercises_classics';
import pop from '../data/exercises_pop';
import news from '../data/exercises_news';
import stem from '../data/exercises_stem';
import { diffChars } from 'diff';
import { motion } from 'framer-motion';

const TypingBox = ({ 
  name,
  category,
  setCategory,
  currentPart,
  setCurrentPart,
  currentParts,
  setCurrentParts,
  onShowStats 
}) => {
 
  const [userInput, setUserInput] = useState('');

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOutFactoid, setFadeOutFactoid] = useState(false);
  const inputRef = useRef(null);
  const datasets = { classic, pop, news, stem };
  const targetExercise = datasets[category][currentPart];
  if (!targetExercise) {
    return <div className="text-center text-red-500">Exercise not found. Please restart.</div>;
  }
  const level = targetExercise.level;
  const currentExercises = datasets[category].filter(ex => ex.level === level);
  const currentIndex = currentExercises.findIndex(ex => ex.id === targetExercise.id); 
  const [progress, setProgress] = useState(() => {
    // ✅ Change: Use state to hold progress so it updates the UI cleanly
    return JSON.parse(localStorage.getItem('progress')) || {};
  });
  
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
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setFadeOutFactoid(false);

    // 🎯 Feature : Focus typing input when new exercise loads
    
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  }, [category, currentPart]);

  // 🔑 Feature: Pressing Enter goes to next exercise after completion
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isComplete) {
        handleNextExercise();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete]);

  // 🔑 Feature: Save progress to localStorage
  /* const saveProgress = (id, accuracy, wpm) => {
    const existing = JSON.parse(localStorage.getItem('progress')) || {};
    existing[id] = { accuracy, wpm, completed: true };
    localStorage.setItem('progress', JSON.stringify(existing));
    //console.log("Saving progress:", id, accuracy, wpm);
  }; */
  const saveProgress = (id, accuracy, wpm) => {
    // ✅ Update both localStorage + progress state for UI updates
    const updated = { ...progress, [id]: { accuracy, wpm, completed: true } };
    localStorage.setItem('progress', JSON.stringify(updated));
    setProgress(updated);
  };

  // This is where we handle the input from a user
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
  
    if (!startTime) setStartTime(Date.now());
    const normalize = (str) => str.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

    const normalizedInput = normalize(value.trim());
    const normalizedTarget = normalize(targetExercise.text.trim());

    if (normalizedInput.length >= normalizedTarget.length) {
      setIsComplete(true);
      setFadeOutFactoid(false);
      setTimeout(() => setFadeOutFactoid(true), 4000);

      // ⬇⬇ Save progress here
    const accuracy = calculateAccuracy(normalizedInput, normalizedTarget);
    const endTime = Date.now();
    const finalElapsed = (endTime - startTime) / 1000;
    const wpm = calculateWPM(normalizedInput, finalElapsed);
    saveProgress(targetExercise.id, accuracy, wpm);
    }
  };
  

  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setFadeOutFactoid(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleNextExercise = () => {
    setCurrentPart((prev) => (prev + 1) % datasets[category].length);
  };

  const renderText = () => {
    const normalize = (str) =>
      (str || '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  
    const target = normalize(targetExercise.text);
    const typed = normalize(userInput);
  
    const diffs = diffChars(target, typed);
  
    let index = 0;
    return diffs.map((part, i) => {
      const chars = part.value.split('');
      return chars.map((char, j) => {
        const key = `${i}-${j}`;
        let className = 'text-gray-400'; // default: not typed
  
        if (part.added) {
          className = 'text-yellow-500'; // extra typed char
        } else if (part.removed) {
          className = 'text-red-500'; // missing expected char
        } else {
          // equal chars
          className = index < typed.length ? 'text-green-600' : 'text-gray-400';
          index++;
        }
  
        return (
          <span key={key} className={className}>
            {char}
          </span>
        );
      });
    });
  };
  

  const sentenceProgressPercent = Math.min((userInput.length / targetExercise.text.length) * 100, 100);
  const stats = [
    { label: 'Accuracy', value: calculateAccuracy(userInput, targetExercise.text) + '%' },
    { label: 'WPM', value: calculateWPM(userInput, elapsedTime) },
    { label: 'Time (s)', value: elapsedTime.toFixed(1) },
  ];

  return (

    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
    <div className="bg-white/60 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-2xl p-6 w-full mx-auto text-center">
  
    <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-purple-700 drop-shadow-md mb-4">
    Culture yourself as you learn to type
    </h2>
      <header className="text-xl text-gray-800 font-bold mb-4">Welcome {name}!</header>
      <p className="text-base sm:text-lg text-gray-800 mb-4">Select a mode below to get started</p>
      {/* Set mode */}
      <div className="mb-6">
        {['classic', 'pop', 'news', 'stem'].map((mode) => (
          <button 
            key={mode}
            /* onClick={() => {
              setCurrentPart(0);        // 🔁 Reset index
              setCategory(mode);        // 🎯 Switch category safely
            }} */
              onClick={() => {
                setCurrentParts((prev) => {
                  const updated = { ...prev, [category]: currentPart };
                  const nextPart = updated[mode] ?? 0;
                  setCurrentPart(nextPart);
                  setCategory(mode);
              
                  return updated;
                });
              }}
            
            className={`px-4 py-2 rounded mr-2 font-semibold transform transition-all duration-200 ease-in-out
              ${
                category === mode
                  ? 'text-white shadow-md scale-105 ' +
                    (mode === 'classic' ? 'bg-purple-700 hover:bg-purple-800' :
                     mode === 'pop' ? 'bg-pink-500 hover:bg-pink-600' :
                     mode === 'news' ? 'bg-blue-600 hover:bg-blue-700' :
                     'bg-green-600 hover:bg-green-700')
                  : 'bg-gray-200 text-gray-800 hover:bg-yellow-100 hover:shadow-md hover:-translate-y-0.5'
              }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

    
      {/* 📚 Progress HUD: Level and Part Tracker */}
        <div className="mb-2">
          <p className="text-xs sm:text-sm text-gray-700 font-semibold">
            Level {targetExercise.level} — Exercise {currentIndex + 1} of {currentExercises.length}
          </p>
          <div className="flex justify-center gap-1 mt-1">
            {currentExercises.map((ex, i) => (
              <span
                key={ex.id}
                className={`w-3 h-3 rounded-full ${
                  i === currentIndex
                    ? 'bg-yellow-500 scale-125'
                    : progress[ex.id]
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                } transition-transform duration-300`}
              />
            ))}
          </div>
        </div>

      {/* Progress bar */}
      <div className="h-3 w-full bg-gray-300 rounded mt-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-yellow-300 transition-all duration-300"
          style={{ width: `${sentenceProgressPercent}%` }}
        />
      </div>

      {/* Text box */}
      <p className="text-lg sm:text-xl tracking-wide bg-white/80 text-gray-800 p-3 rounded-md shadow border border-gray-300 mx-auto font-mono my-4">
        {renderText()}
      </p>

      {/* Factoid box */}
      {isComplete && targetExercise?.factoid && (
        <div
          className={`mt-4 p-4 text-lg font-bold rounded-lg shadow-md border-2 bg-yellow-100 ${
            category === 'classic' ? 'border-purple-700 text-purple-700' :
            category === 'pop' ? 'border-pink-500 text-pink-500' :
            category === 'news' ? 'border-blue-500 text-blue-500' : 'border-green-600 text-green-600'
          }`}
          style={{
            animation: fadeOutFactoid
              ? 'fadeOut 0.5s ease-out forwards'
              : 'fadeSlideIn 0.6s ease-out forwards, pulse 2s ease-in-out 0.8s 3',
          }}
        >
          🌟 Hey {name}, Here's a Fun Fact: {targetExercise.factoid}
        </div>
      )}

      {/* Input box */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isComplete}
        className="w-full text-base sm:text-lg mt-2 p-3 text-gray-700 border-2 border-yellow-300 bg-yellow-50 rounded-md"
      />

      {/* Stats box */}
    
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/80 border border-gray-300 rounded-lg p-4 w-32 shadow">
            <div className="text-xs text-gray-600">{stat.label}</div>
            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded bg-gray-200 font-bold hover:bg-gray-300"
        >
          Restart
        </button>
        <button
          onClick={handleNextExercise}
          disabled={!isComplete}
          className={`px-4 py-2 rounded font-bold ${
            isComplete
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-blue-300 text-white cursor-not-allowed'
          }`}
        >
          Next Exercise
        </button>
      </div>

      {/* Complete message */}  
      {isComplete && (
        <div className="text-yellow-500 text-3xl mt-6 animate-[pop_0.5s_ease-out_forwards]">
          🎉 Exercise Complete!
        </div>
      )}
      {/* Reset data button */}
      
      <div className="mt-4 flex gap-4 justify-center">
      <button
        onClick={onShowStats}
        className="text-sm text-blue-600 underline mt-2"
      >
        View My Stats
      </button>
        <button
          onClick={() => {
            localStorage.removeItem('progress');
            setProgress({});
            setCurrentPart(0);  // ✅ Reset to first part of current mode
            setCurrentParts({
              classic: 0,
              pop: 0,
              news: 0,
              stem: 0
            });
          }}
          className="px-4 py-2 rounded bg-red-100 text-red-600 font-bold hover:bg-red-200"
        >
          Reset Stats/Progress
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('name');
            window.location.reload();  // Easy way to force app to reset name flow
          }}
          className="px-4 py-2 rounded bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200"
        >
          Reset Name
        </button>
      </div>
  
    </div>
    </motion.div>
  );
};

export default TypingBox;
