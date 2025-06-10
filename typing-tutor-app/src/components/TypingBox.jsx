// src/components/TypingBox.jsx

import { useState } from 'react';
import './TypingBox.css';

const TypingBox = () => {
  const targetText = 'hello world';
  const [userInput, setUserInput] = useState('');

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let color;
      if (index < userInput.length) {
        color = char === userInput[index] ? 'green' : 'red';
      } else {
        color = 'black';
      }

      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div>
      <h2>Typing Practice</h2>
      <p style={{ fontSize: '24px', letterSpacing: '2px' }}>{renderText()}</p>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        style={{ width: '300px', fontSize: '18px', marginTop: '10px' }}
      />
    </div>
  );
};

export default TypingBox;


