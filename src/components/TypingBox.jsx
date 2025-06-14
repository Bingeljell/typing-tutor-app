import React, { useEffect, useRef, useState } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import classic from '../data/exercises_classics';
import pop from '../data/exercises_pop';
import news from '../data/exercises_news';
import stem from '../data/exercises_stem';
import { diffChars } from 'diff';

const TypingBox = () => {
  const [category, setCategory] = useState('classic');
  const [userInput, setUserInput] = useState('');
  const [currentPart, setCurrentPart] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOutFactoid, setFadeOutFactoid] = useState(false);
  const inputRef = useRef(null);
  const datasets = { classic, pop, news, stem };
  const targetExercise = datasets[category][currentPart];
  const level = targetExercise.level;
  const currentExercises = datasets[category].filter(ex => ex.level === level);
  const currentIndex = currentExercises.findIndex(ex => ex.id === targetExercise.id); 

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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
  
    if (!startTime) setStartTime(Date.now());
    const normalize = (str) => str.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

    const normalizedInput = normalize(value.trim());
    const normalizedTarget = normalize(targetExercise.text.trim());

    if (normalizedInput.length === normalizedTarget.length) {
      setIsComplete(true);
      setFadeOutFactoid(false);
      setTimeout(() => setFadeOutFactoid(true), 4000);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-yellow-50">
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-100 rounded-xl shadow-md text-center font-serif">
      <h2 className="text-4xl font-bold text-purple-800 drop-shadow mb-2">Culture yourself as you learn to type</h2>
      <p className="text-lg text-gray-800 mb-4">Select a mode below to get started</p>
      {/* Set mode */}
      <div className="mb-6">
        {['classic', 'pop', 'news', 'stem'].map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setCurrentPart(0);        // 🔁 Reset index
              setCategory(mode);        // 🎯 Switch category safely
            }}
            
            className={`px-4 py-2 rounded mr-2 font-semibold transition ${
              category === mode
                ? 'text-white ' +
                  (mode === 'classic' ? 'bg-purple-700' :
                  mode === 'pop' ? 'bg-pink-500' :
                  mode === 'news' ? 'bg-blue-600' : 'bg-green-600')
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

    
      {/* 📚 Progress HUD: Level and Part Tracker */}
        <div className="mb-2">
          <p className="text-sm text-gray-700 font-semibold">
            Level {targetExercise.level} — Exercise {currentIndex + 1} of {currentExercises.length}
          </p>
          <div className="flex justify-center gap-1 mt-1">
            {currentExercises.map((ex, i) => (
              <span
                key={ex.id}
                className={`w-3 h-3 rounded-full ${
                  i === currentIndex
                    ? 'bg-yellow-500 scale-125'
                    : i < currentIndex
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
      <p className="text-2xl tracking-wide bg-white text-gray-800 p-4 rounded-md shadow border border-gray-300 max-w-xl mx-auto font-mono my-6">
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
          🌟 Fun Fact: {targetExercise.factoid}
        </div>
      )}

      {/* Input box */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isComplete}
        className="w-full max-w-xl text-lg mt-2 p-3 text-gray-700 border-2 border-yellow-300 bg-yellow-50 rounded-md"
      />

      {/* Stats box */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 font-sans">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-200 rounded-md p-3 w-[120px] text-center shadow">
            <div className="text-sm text-gray-600">{stat.label}</div>
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
    </div>
    </div>
  );
};

export default TypingBox;
