import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MultiplayerProvider } from './context/MultiplayerContext';
import React, { useState, useEffect } from 'react';

import Landing from './components/Landing';
import TypingBox from './components/TypingBox';
import StatsPage from './components/StatsPage';
import SpeedTestPage from './components/SpeedTestPage'; // aka Time Trial
import MultiplayerWrapper from './routes/MultiplayerWrapper'; // new file

function App() {

  const AppLogger = () => {
    const location = useLocation();
    useEffect(() => {
      console.log('[App] 📍 Route changed:', location.pathname);
    }, [location]);
    return null;
  };
  
  return (
    <MultiplayerProvider>
      <BrowserRouter>
      <AppLogger />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/solo" element={<TypingBoxWrapper />} />
          <Route path="/speed" element={<SpeedTestWrapper />} />
          <Route path="/stats" element={<StatsWrapper />} />
          <Route path="/multiplayer/:peerId" element={<MultiplayerWrapper />} />
        </Routes>
      </BrowserRouter>
    </MultiplayerProvider>
  );
}

export default App;

// 🔽 These are the wrapper components for passing name from localStorage



const TypingBoxWrapper = () => {
  const name = localStorage.getItem('name') || 'Friend';
  

  // 👇 Real state so buttons actually work
  const [category, setCategory] = useState(
    localStorage.getItem('resumeCategory') || 'classic');
  const [currentPart, setCurrentPart] = useState(
    parseInt(localStorage.getItem('resumePart') || '0', 10));
  const [currentParts, setCurrentParts] = useState({
    classic: 0,
    pop: 0,
    news: 0,
    stem: 0
  });

  return (
    <TypingBox
      name={name}
      category={category}
      setCategory={setCategory}
      currentPart={currentPart}
      setCurrentPart={setCurrentPart}
      currentParts={currentParts}
      setCurrentParts={setCurrentParts}
      onShowStats={() => {}}
    />
  );
};

const SpeedTestWrapper = () => {
  const name = localStorage.getItem('name') || 'Friend';
  const navigate = useNavigate();
  return (
    <SpeedTestPage
      name={name}
      onComplete={() => navigate('/speed')}
    />
  );
};

const StatsWrapper = () => {
  const name = localStorage.getItem('name') || 'Friend';
  return (
    <StatsPage
      name={name}
      onBack={() => (window.location.href = '/stats')}
    />
  );
};
