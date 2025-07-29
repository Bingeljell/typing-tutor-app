// src/components/Landing.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MultiplayerPanel from './MultiplayerPanel';
import HostMultiplayerListener from './HostMultiplayerListener';
import HostMatchRequestModal from './HostMatchRequestModal';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useNavigate } from 'react-router-dom';



/*  Start of Landing page */

const Landing = () => {
  /* Start of the name personalization feature */
  const [localName, setLocalName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setLocalName(storedName);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localName.trim()) {
      localStorage.setItem('name', localName);
      navigate('/solo')
    }
  };
  const handleMultiplayerJoin = () => {
    const nameToSave = localName?.trim() || localStorage.getItem('name') || '';
    if (!nameToSave) {
      alert("Please enter your name before joining Multiplayer!");
      return;
    }
    localStorage.setItem('name', nameToSave);
    setMyName(nameToSave);
  };
  const [showFullInstructions, setShowFullInstructions] = useState(false);


  const {
    peerId,
    pendingConnection,
    pendingPeerName,
    setPendingConnection,
    setPendingPeerName,
    setMyName,
  } = useMultiplayer();
  
  const navigate = useNavigate();

    return (
      //<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100 text-center p-6 font-sans">
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100 text-center p-4 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
       <div className="bg-white/60 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-2xl p-6 max-w-4xl w-full mx-auto text-center">
        {/* <h1 className="text-5xl font-bold text-purple-800 mb-4">GutenKeys</h1> */}
        <h1 className="sm:text-4xl font-extrabold text-purple-700 drop-shadow-lg font-display mb-4 tracking-tight">GutenKeys</h1>

        {/* <p className="text-lg text-gray-700 mb-8">An experiment to culture our youth as they learn how to type.</p> */}
        <p className="sm:text-md text-gray-700 mb-2 leading-relaxed">
          Unlock the world of words, one keystroke at a time! <br /><br />
          Ready for an adventure? At GutenKeys, you’ll <strong>dive into the minds of great authors</strong>, <strong>re-live iconic moments from pop culture</strong>, and <strong>explore science and news that shape our world</strong>, all while sharpening your typing skills.  
          <br /><br />
          Every sentence you type brings a new discovery: from the curious world of <em>Alice in Wonderland</em> to the breakthroughs of STEM heroes. Whether you’re learning for school, fun, or future greatness, this is where your typing journey begins!
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-8">
          <input
            type="text"
            placeholder="Enter your name"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="border rounded p-2 w-64 text-center"
          />
          <button
            type="submit"
            disabled= {!localName.trim()}
            onClick={(e) => {
              e.preventDefault();
              if (localName.trim()) {
                localStorage.setItem('name', localName);
                navigate('/solo');
              }
            }}
            className={`bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold text-lg ${!localName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            🚀 Start Typing Adventure
          </button>
          </form>
          <button
            type="button"
            onClick={() => navigate('/speed')}
            className="bg-gradient-to-r from-pink-500 m-4 via-purple-600 to-yellow-400 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold"
          >
            Time Trial ⚡
          </button>
          
          {/*           <button
            onClick={() => onMultiplayerJoin()}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold"
          >
            Multiplayer Room 🎮
          </button> */}
          <a
            href="https://forms.gle/v5MPkP3fuWd1W9L36"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white px-4 py-2 rounded-full shadow hover:bg-white hover:text-gray-400 transition"
          >
            💬 Feature Request / Give Feedback
          </a>
          <MultiplayerPanel 
          onConnected={handleMultiplayerJoin} // for the player
          onIncomingConnection={handleMultiplayerJoin} // for the host
          />
          <HostMultiplayerListener />
          
          {/* Instructions begin */}
          <div className="bg-white/90 backdrop-blur-lg border border-yellow-300 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mt-8 text-left transition-transform hover:scale-[1.01] relative max-w-4xl">
            <h3 className="sm:text-2xl font-bold text-purple-700 mb-4">👋 Welcome to the Typing Tutor!</h3>
            <p className="text-gray-700 mb-4">Follow these quick tips to get started:</p>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                showFullInstructions ? 'max-h-[420px]' : 'max-h-20'
              }`}
            >
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-base leading-relaxed">
                <li>
                  Choose a <strong>category</strong> you’d like to explore: classic literature, pop culture, science, and more!
                </li>
                <li>
                  When you finish typing a sentence, just press <kbd>Enter</kbd> to jump to the next one.
                </li>
                <li>
                  A <strong>Speed Test Feature</strong> is being worked upon — you can already challenge your friends.
                </li>
                <li>
                  Focus on <strong>accuracy</strong> first, speed will follow naturally.
                </li>
                <li>
                  The current teacher is lenient — you’ll see mistakes but won’t be penalized.
                </li>
                <li>
                  Fun facts appear after each sentence — learn something new every time!
                </li>
              </ul>
            </div>

            {!showFullInstructions && (
              <div className="absolute bottom-1 left-0 w-full h-14 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-2xl" />
            )}

            <div
              className="text-blue-600 underline hover:text-blue-800 text-sm text-right cursor-pointer"
              onClick={() => setShowFullInstructions(!showFullInstructions)}
            >
              {showFullInstructions ? 'Show less ▲' : 'Read more... ▼'}
            </div>
          </div>





{/*           <div className="bg-white/90 backdrop-blur-lg border border-yellow-300 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mt-8 text-left transition-transform hover:scale-[1.01]">

          <h3 className="sm:text-2xl font-bold text-purple-700 mb-4">👋 Welcome to the Typing Tutor!</h3>
          <p className="text-gray-700 mb-4">
            Follow these quick tips to get started:
          </p>
          <ul className="sm:text-base list-disc pl-6 space-y-3 text-gray-700 text-base leading-relaxed">
            <li>
              Choose a <strong>category</strong> you’d like to explore: classic literature, pop culture, science, and more!
            </li>
            <li>
              When you finish typing a sentence, just press <kbd>Enter</kbd> to jump to the next one.
            </li>
            <li>
              A <strong>Speed Test Feature</strong> is being worked upon, you can already test your speed and challenge your friends, we'll add time trials soon.
            </li>
            <li>
              Focus on <strong>accuracy</strong> first, speed will follow naturally.
            </li>
            <li>
              The current teacher is very lenient and will not peanlise you for minor errors, but you'll still see the errors you make. This is intended.
            </li>
            <li>
              Watch for fun facts after each sentence, you might learn something new!
            </li>
          </ul>
        </div> */}
        {/* Instructions end */}
        
        {pendingConnection && (
          <HostMatchRequestModal
            peerName={pendingPeerName}
            onAccept={() => {
              setPendingConnection(false);
              navigate(`/multiplayer/${peerId}`);
            }}
            onDecline={() => {
              setPendingConnection(false);
              setPendingPeerName('');
            }}
          />
        )}


        
       </div>
      </motion.div>
    );
  };
 
export default Landing;
  