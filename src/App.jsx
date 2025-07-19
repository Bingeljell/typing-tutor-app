import { useState } from 'react';
import TypingBox from './components/TypingBox';
import Landing from './components/Landing';
import StatsPage from './components/StatsPage';
import SpeedTestPage from './components/SpeedTestPage';
import MultiplayerRoom from './components/MultiplayerRoom';
import ConnectionConfirmModal from './components/ConnectionConfirmModal';
import { MultiplayerProvider, useMultiplayer } from './context/MultiplayerContext';

function InnerApp({
  hasStarted, setHasStarted,
  showStats, setShowStats,
  showMultiplayerRoom, setShowMultiplayerRoom,
  name, setName,
  category, setCategory,
  currentPart, setCurrentPart,
  currentParts, setCurrentParts,
  showSpeedTest, setShowSpeedTest
}) {
  const {
    opponentName,
    isConnectionApproved,
    setIsConnectionApproved
  } = useMultiplayer();

  return (
    <>
      {showMultiplayerRoom ? (
        !isConnectionApproved ? (
          <ConnectionConfirmModal
            myName={name}
            opponentName={opponentName}
            onConfirm={() => setIsConnectionApproved(true)}
          />
        ) : (
          <MultiplayerRoom
            name={name}
            onComplete={() => {
              setShowMultiplayerRoom(false);
              setIsConnectionApproved(false);
            }}
          />
        )
      ) : showStats ? (
        <StatsPage
          onBack={() => setShowStats(false)}
          name={name}
        />
      ) : showSpeedTest ? (
        <SpeedTestPage
          name={name}
          onComplete={() => {
            setShowSpeedTest(false);
            setHasStarted(true);
          }}
        />
      ) : hasStarted ? (
        <TypingBox
          name={name}
          category={category}
          setCategory={setCategory}
          currentPart={currentPart}
          setCurrentPart={setCurrentPart}
          currentParts={currentParts}
          setCurrentParts={setCurrentParts}
          onShowStats={() => setShowStats(true)}
        />
      ) : (
        <Landing
          onStart={() => setHasStarted(true)}
          onSpeedTest={() => setShowSpeedTest(true)}
          setName={setName}
          onMultiplayerJoin={() => {
            console.log("🔥 Triggered onMultiplayerJoin from App.jsx");
            setShowMultiplayerRoom(true);
          }}
        />
      )}
    </>
  );
}

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMultiplayerRoom, setShowMultiplayerRoom] = useState(false);
  const [name, setName] = useState(localStorage.getItem('name') || 'Friend');
  const [category, setCategory] = useState('classic');
  const [currentPart, setCurrentPart] = useState(0);
  const [currentParts, setCurrentParts] = useState({
    classic: 0,
    pop: 0,
    news: 0,
    stem: 0
  });
  const [showSpeedTest, setShowSpeedTest] = useState(false);

  return (
    <MultiplayerProvider>
      <InnerApp
        hasStarted={hasStarted}
        setHasStarted={setHasStarted}
        showStats={showStats}
        setShowStats={setShowStats}
        showMultiplayerRoom={showMultiplayerRoom}
        setShowMultiplayerRoom={setShowMultiplayerRoom}
        name={name}
        setName={setName}
        category={category}
        setCategory={setCategory}
        currentPart={currentPart}
        setCurrentPart={setCurrentPart}
        currentParts={currentParts}
        setCurrentParts={setCurrentParts}
        showSpeedTest={showSpeedTest}
        setShowSpeedTest={setShowSpeedTest}
      />
    </MultiplayerProvider>
  );
}

export default App;
