import React, { useState, useEffect, useRef } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import { motion } from 'framer-motion';

const SpeedTestPage = ({ onComplete, name }) => {
  const target = "The quick brown fox jumps over the lazy dog.";
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);

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
      <div className="max-w-xl bg-white/90 backdrop-blur-lg border rounded-xl shadow p-8 text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">⚡ Typing Speed Test</h1>
        <p className="mb-2 text-gray-700 font-semibold">Welcome, {name}!</p>
        <p className="mb-4 text-gray-600">Type the sentence below as fast and accurately as you can:</p>
        <p className="mb-4 text-lg font-mono bg-gray-100 p-2 text-gray-700 rounded">{target}</p>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          disabled={isComplete}
          className="w-full border p-2 rounded mb-4"
        />

        {isComplete && (
          <div className="mt-4">
            <p className="text-green-700 font-bold">✅ Speed Test Complete!</p>
            <p className="text-gray-700">Accuracy: {accuracy}%</p>
            <p className="text-gray-700">WPM: {wpm}</p>
            <button
              onClick={onComplete}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
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
