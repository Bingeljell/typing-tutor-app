import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MultiplayerProvider } from './context/MultiplayerContext';

import Landing from './components/Landing';
import TypingBox from './components/TypingBox';
import StatsPage from './components/StatsPage';
import SpeedTestPage from './components/SpeedTestPage'; // aka Time Trial
import MultiplayerWrapper from './routes/MultiplayerWrapper'; // new file

function App() {
  return (
    <MultiplayerProvider>
      <BrowserRouter>
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
  return <TypingBox name={name} />;
};

const SpeedTestWrapper = () => {
  const name = localStorage.getItem('name') || 'Friend';
  return (
    <SpeedTestPage
      name={name}
      onComplete={() => (window.location.href = '/solo')}
    />
  );
};

const StatsWrapper = () => {
  const name = localStorage.getItem('name') || 'Friend';
  return (
    <StatsPage
      name={name}
      onBack={() => (window.location.href = '/solo')}
    />
  );
};
