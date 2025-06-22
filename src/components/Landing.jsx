// src/components/Landing.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


/*  Start of Landing page */

const Landing = ({ onStart }) => {
  /* Start of the name personalization feature */
  const [name, setName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('name', name);
      onStart();
    }
  };

    return (
      //<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100 text-center p-6 font-sans">
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100 text-center p-6 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* <h1 className="text-5xl font-bold text-purple-800 mb-4">GutenKeys</h1> */}
        <h1 className="text-6xl font-extrabold text-purple-700 drop-shadow-lg font-display mb-4 tracking-tight">GutenKeys</h1>

        <p className="text-lg text-gray-700 mb-8">An experiment to culture our youth as they learn how to type.</p>
          {/* <div className="bg-white border border-yellow-200 rounded-lg shadow p-6 max-w-xl mx-auto mt-6 text-left"> */}
          <div className="bg-white/90 backdrop-blur-lg border border-yellow-300 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto mt-8 text-left transition-transform hover:scale-[1.01]">

          <h3 className="text-2xl font-bold text-purple-700 mb-4">👋 Welcome to the Typing Tutor!</h3>
          <p className="text-gray-700 mb-4">
            Follow these quick tips to get started:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-gray-700 text-base leading-relaxed">
            <li>
              Choose a <strong>category</strong> you’d like to explore — classic literature, pop culture, science, and more!
            </li>
            <li>
              When you finish typing a sentence, just press <kbd>Enter</kbd> to jump to the next one.
            </li>
            <li>
              Focus on <strong>accuracy</strong> first — speed will follow naturally.
            </li>
            <li>
              Watch for fun facts after each sentence — you might learn something new!
            </li>
          </ul>
        </div>

        {/* <button
          onClick={onStart}
          className="mt-10 bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold text-lg"
        >
          🚀 Start Typing Adventure
        </button> */}

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-8">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 w-64 text-center"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold text-lg"
          >
            🚀 Start Typing Adventure
          </button>
        </form>
      </motion.div>
    );
  };
 
export default Landing;
  