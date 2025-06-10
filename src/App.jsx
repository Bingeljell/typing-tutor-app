import { useState } from 'react'
import './App.css'
import TypingBox from './components/TypingBox';


function App() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Typing Tutor App</h1>
      <TypingBox />
    </div>
  );
}

export default App
