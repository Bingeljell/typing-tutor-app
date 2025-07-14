import { useState } from 'react';
import TypingBox from './components/TypingBox';
import Landing from './components/Landing';
import StatsPage from './components/StatsPage';
import SpeedTestPage from './components/SpeedTestPage';
import { MultiplayerProvider } from './context/MultiplayerContext';
import MultiplayerRoom from './components/MultiplayerRoom';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMultiplayerRoom, setShowMultiplayerRoom] = useState(false);


  // Lifted state
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
      {showMultiplayerRoom ? (
        <MultiplayerRoom
          name={name}
          onComplete={() => setShowMultiplayerRoom(false)} // optional exit/reset
        />
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
    </MultiplayerProvider>
  );  
}

export default App;
