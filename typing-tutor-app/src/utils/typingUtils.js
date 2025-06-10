// src/utils/typingUtils.js

export const calculateWPM = (userInput, elapsedTime) => {
  if (elapsedTime === 0) return 0;
  const wordsTyped = userInput.trim().split(/\s+/).length;
  return Math.round((wordsTyped / elapsedTime) * 60);
};

export const calculateAccuracy = (userInput, targetText) => {
    const targetWords = (targetText || '').trim().split(/\s+/);
    const inputWords = (userInput || '').trim().split(/\s+/);
  
    let correct = 0;
    for (let i = 0; i < inputWords.length; i++) {
      if (inputWords[i] === targetWords[i]) {
        correct++;
      }
    }
  
    return inputWords.length > 0
      ? Math.round((correct / inputWords.length) * 100)
      : 100;
  };