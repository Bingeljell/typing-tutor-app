import React, { useState, useEffect, useRef } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import { motion } from 'framer-motion';
import { diffChars } from 'diff';
import classic from '../data/exercises_classics';
import pop from '../data/exercises_pop';
import news from '../data/exercises_news';
import stem from '../data/exercises_stem';


const SpeedTestPage = ({ onComplete, name }) => {

  

  // Pick a category at random
  const timeTrialPool = [
    ...classic,
    ...pop,
    ...news,
    ...stem
  ];

  const [target, setTarget] = useState('');
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * timeTrialPool.length);
    setTarget(timeTrialPool[randomIndex].text);
  }, []);


  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  useEffect(() => {
    let timer;
    if (startTime && !isComplete) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        setElapsedTime(elapsed);
        setTimeLeft(30 - Math.floor(elapsed));
        if (elapsed >= 30) {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [startTime, isComplete]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  useEffect(() => {
    if (timeTrialPool.length > 0) {
      setTarget(timeTrialPool[currentExerciseIndex].text);
    }
  }, [currentExerciseIndex]);

  // Track input against target for accuracy 

  const renderText = () => {
    const normalize = (str) => str.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
    const targetNorm = normalize(target);
    const inputNorm = normalize(input);
  
    const diffs = diffChars(targetNorm, inputNorm);
    let index = 0;
  
    return diffs.map((part, i) => {
      const chars = part.value.split('');
      return chars.map((char, j) => {
        const key = `${i}-${j}`;
        let className = 'text-gray-400';
  
        if (part.added) {
          className = 'text-yellow-500';
        } else if (part.removed) {
          className = 'text-red-500';
        } else {
          className = index < inputNorm.length ? 'text-green-600' : 'text-gray-400';
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
const [cumulativeInput, setCumulativeInput] = useState('');
const [cumulativeTarget, setCumulativeTarget] = useState('');



/*   useEffect(() => {
    if (startTime && !isComplete) {
      const timer = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [startTime, isComplete]); */

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!startTime) setStartTime(Date.now());

    if (value.length >= target.length) {
      // move to next exercise
      const nextIndex = currentExerciseIndex + 1;
    
      // accumulate
      setCumulativeInput((prev) => prev + input);   // add user typed text
      setCumulativeTarget((prev) => prev + target); // add the correct text
    
      if (nextIndex < timeTrialPool.length) {
        setCurrentExerciseIndex(nextIndex);
        setInput('');
      } else {
        setCurrentExerciseIndex(0);
        setInput('');
      }
    }
  };
  const restartTimeTrial = () => {
    const randomIndex = Math.floor(Math.random() * timeTrialPool.length);  // define here
    setInput('');
    setCumulativeInput('');
    setCumulativeTarget('');
    setCurrentExerciseIndex(randomIndex);
    setTarget(timeTrialPool[randomIndex].text);
    setElapsedTime(0);
    setTimeLeft(60);
    setIsComplete(false);
    setStartTime(null);
  };
  const accuracy = calculateAccuracy(cumulativeInput, cumulativeTarget);
  const wpm = calculateWPM(cumulativeInput, elapsedTime);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-purple-100 to-pink-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-lg border rounded-xl shadow p-8 text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">⚡ Time Trial ⚡</h1>
        <p className="mb-2 text-gray-700 font-semibold">Welcome, {name}!</p>
        <p className="mb-4 text-gray-600">Type the sentence below as fast and accurately as you can:</p>
        <p className="text-xl font-semibold text-purple-700 mb-2">
          Time Left: {timeLeft}s
        </p>
        {/* <p className="mb-4 text-lg font-mono bg-gray-100 p-2 text-gray-700 rounded">{target}</p> */}
        <div className="relative overflow-hidden min-h-[200px] w-full h-24 bg-gray-100 rounded mb-4 border max-w-5xl">
          <div
            className="absolute whitespace-pre-wrap transition-transform"
            style={{ transform: `translateY(-${input.length * 0.2}px)` }} // Vertical scroll and speed control
          >
            {renderText()}
          </div>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          disabled={isComplete}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={() => (window.location.href = '/')}
          className="mb-4 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white px-6 py-2 rounded shadow hover:brightness-110 transition-all duration-300 font-semibold text-base"
        >
          Back to Main
        </button>
        {isComplete && (
          <div className="mt-4 mb-4">
            <p className="text-green-700 font-bold">✅ Time Trial Complete!</p>
            <p className="text-gray-600">Challenges your friends to a Type-off!</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 shadow w-32">
                <div className="text-sm text-purple-700">Accuracy</div>
                <div className="text-2xl font-bold text-purple-900">{accuracy}%</div>
              </div>
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 shadow w-32">
                <div className="text-sm text-blue-700">WPM</div>
                <div className="text-2xl font-bold text-blue-900">{wpm}</div>
              </div>
            </div>
            <button
              onClick={restartTimeTrial}
              className="mt-4 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold text-lg"
            >
              Restart Time Trial
            </button>
            <button
              onClick={onComplete}
              className="mt-4 bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold text-lg"
            >
              Continue to Typing Adventure
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SpeedTestPage;
