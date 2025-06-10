// src/utils/typingUtils.js

export const calculateWPM = (userInput, elapsedTime) => {
    if (elapsedTime === 0) return 0;
    const wordsTyped = userInput.trim().split(/\s+/).length;
    return Math.round((wordsTyped / elapsedTime) * 60);
  };
  
  export const calculateAccuracy = (userInput, targetText) => {
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) correct++;
    }
    return userInput.length > 0
      ? Math.round((correct / userInput.length) * 100)
      : 100;
  };
  