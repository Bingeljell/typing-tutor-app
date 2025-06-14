import { useState } from 'react';
import TypingBox from './components/TypingBox';
import Landing from './components/Landing';

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    {hasStarted ? (
    <TypingBox />
  ) : (
    <Landing onStart={() => setHasStarted(true)} />
  )}
    </div>
  );
}
export default App;
