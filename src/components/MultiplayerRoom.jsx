import React, { useState, useEffect, useRef } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import { motion } from 'framer-motion';
import { diffChars } from 'diff';
import { useMultiplayer } from '../context/MultiplayerContext';
import { multiplayerPassages } from '../data/exercises_multiplayer';
import { useParams } from 'react-router-dom';



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
    multiplayerTarget,
    setMultiplayerTarget,
    multiplayerMeta,
    setMultiplayerMeta,
    isHostUser
    
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
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedPassageId, setSelectedPassageId] = useState('');

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  
  const { peerId } = useParams();
  const isHost = isHostUser;
  
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
  
  // Sync target from host
  useEffect(() => {
    if (multiplayerTarget) {
      console.log("🧩 Applying target to local state:", multiplayerTarget);
      setTarget(multiplayerTarget);
    }
  }, [multiplayerTarget]);

  useEffect(() => {
    console.log("🔍 useEffect running with values:", {
      isHost,
      connExists: !!conn,
      connOpen: conn?.open,
      multiplayerTarget,
      multiplayerMeta,
    });

    if (isHost && conn?.open && multiplayerTarget && multiplayerMeta) {
      console.log("📤 Host useEffect sending target to peer", {
        text: multiplayerTarget,
        ...multiplayerMeta,
      });
  
      conn.send({
        type: 'target',
        value: {
          text: multiplayerTarget,
          author: multiplayerMeta.author,
          label: multiplayerMeta.label,
        },
      });
    }
  }, [conn, multiplayerTarget, multiplayerMeta, target]);

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
  
  useEffect(() => {
    console.log("🧭 Role:", isHost ? "Host" : "Peer");
  }, []);

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
        <div className="flex flex-col items-center justify-center gap-2 mb-6">

          {/* Author Dropdown */}
          <select
            value={selectedAuthor}
            onChange={(e) => {
              setSelectedAuthor(e.target.value);
              setSelectedPassageId('');
            }}
            className="border px-4 py-2 rounded shadow text-sm w-72"
          >
            <option value="">📚 Select an Author</option>
            {Object.entries(multiplayerPassages).map(([id, { title }]) => (
              <option key={id} value={id}>{title}</option>
            ))}
          </select>

          {/* Passage Dropdown */}
          <select
            value={selectedPassageId}
            onChange={(e) => {
              const pid = e.target.value;
              setSelectedPassageId(pid);
              const { text, label } = multiplayerPassages[selectedAuthor].contents[pid];
              const authorTitle = multiplayerPassages[selectedAuthor].title;
            
              // Local target
              setTarget(text);
              setMultiplayerTarget(text);
              setMultiplayerMeta({ author: authorTitle, label });
            
              // Send to peer
              if (isHost && conn?.open) {
                console.log("📤 Host sending target", { text, author: authorTitle, label });
                
              }
            }}
            
            disabled={!selectedAuthor}
            className={`border px-4 py-2 rounded shadow text-sm w-72 ${!selectedAuthor ? 'bg-gray-100 text-gray-400' : ''}`}
          >
            <option value="">📝 Select a Passage</option>
            {selectedAuthor &&
              Object.entries(multiplayerPassages[selectedAuthor].contents).map(([id, { label }]) => (
                <option key={id} value={id}>{label}</option>
              ))}
          </select>
          {!isHost && (
            <div className="text-xs text-gray-500 italic mt-1">
              👀 The host will pick the passage.
            </div>
          )}  

          {/* Hint if author is not selected */}
          {!selectedAuthor && (
            <div className="text-xs text-gray-500 mt-1">
              👆 Please select an author first to see available passages.
            </div>
          )}

        </div>



        <p className="mb-2 text-gray-700 font-semibold">Welcome, {name}!</p>
        {/* 🧠 Show selected passage info to both users */}
        {multiplayerMeta && (
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Passage Selected:</span>{' '}
            <span>{multiplayerMeta.author} — {multiplayerMeta.label}</span>
          </div>
        )}
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
          <button onClick={signalReady}
          disabled={!target}
          className={`px-4 py-2 mb-4 rounded font-bold text-white transition-all ${
            target ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
          >I’m Ready</button>
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
          onClick={() => {
            localStorage.removeItem('isHost');
            window.location.href = '/';
          }}
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
                setSelectedAuthor('');
                setSelectedPassageId('');
                setMultiplayerTarget(null);
                setMultiplayerMeta(null); 

                // 🔔 Notify peer
                if (isHost && conn?.open) {
                  conn.send({ type: 'rematch-request', name });
                  console.log("📣 Sent rematch request to peer");
                }
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
