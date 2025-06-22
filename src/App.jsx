import { useState } from 'react';
import TypingBox from './components/TypingBox';
import Landing from './components/Landing';
import StatsPage from './components/StatsPage';
import SpeedTestPage from './components/SpeedTestPage';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showStats, setShowStats] = useState(false);

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


  if (showStats) {
    return <StatsPage 
    onBack={() => setShowStats(false)} 
    name={name}
    />;
  }
  if (showSpeedTest) {
    return <SpeedTestPage name={name} onComplete={() => { setShowSpeedTest(false); setHasStarted(true); }} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {hasStarted ? (
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

        />
      )}
    </div>
  );
}
export default App;
