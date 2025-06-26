import React, { useState, useEffect, useRef } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import { motion } from 'framer-motion';
import { diffChars } from 'diff';

const SpeedTestPage = ({ onComplete, name }) => {
  const target = `Well! thought Alice to herself, after such a fall as this, I shall think nothing of tumbling down stairs!
    How brave they'll all think me at home! Why, I wouldn't say anything about it, even if I fell off the top of the house!
    (Which was very likely true.)

    Down, down, down. Would the fall never come to an end! I wonder how many miles I've fallen by this time? she said aloud.
    I must be getting somewhere near the centre of the earth.`;
  //const targetShort = "Roses are red and violets are blue";  
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);
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

  useEffect(() => {
    if (startTime && !isComplete) {
      const timer = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [startTime, isComplete]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!startTime) setStartTime(Date.now());

    if (value.length >= target.length) {
      setIsComplete(true);
    }
  };

  const accuracy = calculateAccuracy(input, target);
  const wpm = calculateWPM(input, elapsedTime);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-purple-100 to-pink-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl bg-white/90 backdrop-blur-lg border rounded-xl shadow p-8 text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">⚡ Typing Speed Test</h1>
        <p className="mb-2 text-gray-700 font-semibold">Welcome, {name}!</p>
        <p className="mb-4 text-gray-600">Type the sentence below as fast and accurately as you can:</p>
        {/* <p className="mb-4 text-lg font-mono bg-gray-100 p-2 text-gray-700 rounded">{target}</p> */}
        <p className="text-lg font-mono bg-gray-100 p-2 rounded mb-4">
          {renderText()}
        </p>  
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          disabled={isComplete}
          className="w-full border p-2 rounded mb-4"
        />

        {isComplete && (
          <div className="mt-4 mb-4">
            <p className="text-green-700 font-bold">✅ Speed Test Complete!</p>
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
