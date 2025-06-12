import { useState } from 'react'
import './App.css'
import TypingBox from './components/TypingBox';


function App() {
  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <h1>GutenKeys Typing Tutor</h1>
      <TypingBox />
    </div>
  );
}

export default App
