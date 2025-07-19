import React, { useState, useEffect, useRef } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import { motion } from 'framer-motion';
import { diffChars } from 'diff';
import { useMultiplayer } from '../context/MultiplayerContext';

const MultiplayerRoom = ({ onComplete, name }) => {

  // MP stats
  const {
    sendProgress,
    opponentProgress,
    signalReady,
    conn,
    signalDone,
    ready,
    opponentReady,
    bothReady,
    setBothReady,
    gameStarted,
    setGameStarted,
    gameOver,
    setGameOver,
    youWon,
    resetMatch,
    myFinalStats,
    opponentFinalStats,
    decideWinner,
  } = useMultiplayer();
  console.log("🎯 gameOver:", gameOver);
  console.log("👤 opponentProgress:", opponentProgress);
  console.log("🏆 youWon:", youWon);
  console.log("🎯 myFinalStats:", myFinalStats);
  console.log("🎯 opponentFinalStats:", opponentFinalStats);
  
  const normalize = (str) =>
    str.replace(/['’‘]/g, "'").replace(/["”“]/g, '"');
  const { readyNotification } = useMultiplayer();

  
  const [target, setTarget] = useState(`When you have eliminated the impossible, whatever remains, however improbable, must be the truth.`);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);

  
  // Track input against target for accuracy 

  const renderText = () => {
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

const handleChange = (e) => {
  const value = e.target.value;
  setInput(value);

  if (!startTime) setStartTime(Date.now());

  // Normalize input/target
  const normalizedInput = normalize(value.trim());
  const normalizedTarget = normalize(target.trim());

  // Calculate live stats
  const liveAccuracy = calculateAccuracy(normalizedInput, normalizedTarget);
  const liveElapsed = (Date.now() - startTime) / 1000;
  const liveWPM = calculateWPM(normalizedInput, liveElapsed);

  setAccuracy(liveAccuracy);
  setWpm(liveWPM);

  // Send progress to opponent
  sendProgress({
    inputLength: normalizedInput.length,
    accuracy: liveAccuracy,
    wpm: liveWPM,
  });
  if (gameStarted) {
    sendProgress({
      inputLength: normalizedInput.length,
      accuracy: liveAccuracy,
      wpm: liveWPM,
    });
  }
  console.log("📤 sending progress:", {
    inputLength: normalizedInput.length,
    accuracy: liveAccuracy,
    wpm: liveWPM,
  });  

  if (value.length >= target.length) {
    setIsComplete(true);
    signalDone({
      wpm: liveWPM,
      accuracy: liveAccuracy,
    });
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

  // Final stats for both peer / host
  useEffect(() => {
    if (myFinalStats && opponentFinalStats && !gameOver) {
      console.log('🎯 Running decideWinner from useEffect');
      decideWinner(myFinalStats, opponentFinalStats);
      setGameOver(true);
    }
  }, [myFinalStats, opponentFinalStats]);
  

  // Multiplayer countdown feature
  useEffect(() => {
      console.log("🔄 Ready States", { ready, opponentReady, gameStarted });
      if (ready && opponentReady && !gameStarted) {
        console.log("🎬 Both ready — starting countdown...");
        setBothReady(true);
        setTimeout(() => {
          setGameStarted(true);
        }, 3000); // 3...2...1...Go!
      }
    }, [ready, opponentReady]);

  console.log("🔍 multiplayer state:", {
    ready,
    opponentReady,
    gameStarted,
    connOpen: conn?.open,
  });
    

  // Load the page
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
        <div className="relative overflow-hidden min-h-[200px] w-full h-24 bg-gray-100 rounded mb-4 border max-w-5xl">
          <div
            className="absolute whitespace-pre-wrap transition-transform"
            style={{ transform: `translateY(-${input.length * 0.1}px)` }} // Vertical scroll and speed control
          >
            {renderText()}
          </div>
        </div>
        {readyNotification && (
          <div className="text-blue-700 font-semibold mb-2">
            {readyNotification}
          </div>
        )}  
        {!ready && !gameStarted && (
          <button onClick={signalReady}>I’m Ready</button>
        )}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          
          disabled={!gameStarted || isComplete}
          className="w-full border p-2 rounded mb-4"
        />
        {bothReady && !gameStarted && (
            <div className="text-center text-red-500 text-xl font-bold my-4 animate-pulse"> // This is the count down for live match
              Starting in 3... 2... 1...
            </div>
          )}
        {console.log("🟡 opponentProgress", opponentProgress)}
        {opponentProgress && (
          <div className="mt-4 text-sm text-gray-600">
            <p>👤 Opponent progress:</p>
            <p>WPM: {Math.round(opponentProgress.wpm)}</p>
            <p>Accuracy: {Math.round(opponentProgress.accuracy)}%</p>
            <p>Typed: {opponentProgress.inputLength} chars</p>
          </div>
        )}
          {gameOver && (
            <div className="text-center text-red-500 text-2xl font-bold mt-4">
              {youWon ? '🏆 You Win!' : '😅 You Lose'}
            </div>
          )}

        <button
          onClick={() => (window.location.href = '/')}
          className="mb-4 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white px-6 py-2 rounded shadow hover:brightness-110 transition-all duration-300 font-semibold text-base"
        >
          Back to Main
        </button>
        {isComplete && (
          <div className="mt-4 mb-4">
            <p className="text-green-700 font-bold">✅ Time Trial Complete!</p>
            <p className="text-gray-600">Challenge your friends to a Type-off!</p>
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
              onClick={() => {
                resetMatch(); // Reset multiplayer context
                setInput('');
                setIsComplete(false);
                setStartTime(null);
                setAccuracy(0);
                setWpm(0);
              }}
              className="mt-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-400 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold text-lg"
            >
              🔁 Rematch
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MultiplayerRoom;
