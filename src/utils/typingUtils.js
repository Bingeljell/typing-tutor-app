// src/utils/typingUtils.js

/* export const calculateWPM = (userInput, elapsedTime) => {
  if (elapsedTime === 0) return 0;
  const wordsTyped = userInput.trim().split(/\s+/).length;
  return Math.round((wordsTyped / elapsedTime) * 60);
};

export const calculateAccuracy = (userInput, targetText) => {
    const targetWords = (targetText || '').trim().split(/\s+/);
    const inputWords = (userInput || '').trim().split(/\s+/);
    const normalize = (str) => str.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

  
    let correct = 0;
    for (let i = 0; i < inputWords.length; i++) {
      if (inputWords[i] === targetWords[i]) {
        correct++;
      }
    }
  
    return inputWords.length > 0
      ? Math.round((correct / inputWords.length) * 100)
      : 100;
  }; */


  // src/utils/typingUtils.js
import stringSimilarity from 'string-similarity';

export const calculateWPM = (userInput, elapsedTime) => {
  if (elapsedTime === 0) return 0;
  const wordsTyped = userInput.trim().split(/\s+/).length;
  return Math.round((wordsTyped / elapsedTime) * 60);
};

export const calculateAccuracy = (userInput, targetText) => {
  const normalize = (str) =>
    (str || '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();

  const targetWords = normalize(targetText).split(/\s+/);
  const inputWords = normalize(userInput).split(/\s+/);

  let correct = 0;
  const matchedIndices = new Set();

  for (let i = 0; i < targetWords.length; i++) {
    const targetWord = targetWords[i];
    let bestScore = 0;
    let bestMatchIndex = -1;

    // Check against all input words, find best match
    for (let j = 0; j < inputWords.length; j++) {
      if (matchedIndices.has(j)) continue;

      const score = stringSimilarity.compareTwoStrings(targetWord, inputWords[j]);

      if (score > bestScore) {
        bestScore = score;
        bestMatchIndex = j;
      }
    }

    if (bestScore >= 0.8) { // 80%+ similarity counts as correct
      correct++;
      matchedIndices.add(bestMatchIndex);
    }
  }

  return Math.round((correct / targetWords.length) * 100);
};

