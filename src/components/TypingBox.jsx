import React, { useEffect, useRef, useState } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import classic from '../data/exercises_classics';
import pop from '../data/exercises_pop';
import news from '../data/exercises_news';
import stem from '../data/exercises_stem';
import { diffChars } from 'diff';
import { motion } from 'framer-motion';
import html2canvas from "html2canvas";
import SummaryCard from "./SummaryCard";

const TypingBox = ({ 
  name,
  category,
  setCategory,
  currentPart,
  setCurrentPart,
  currentParts,
  setCurrentParts,
  onShowStats 
}) => {
 
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOutFactoid, setFadeOutFactoid] = useState(false);
  const inputRef = useRef(null);
  const datasets = { classic, pop, news, stem };
  const targetExercise = datasets[category][currentPart];
  
  if (!targetExercise) {
    return <div className="text-center text-red-500">Exercise not found. Please restart.</div>;
  }
  
  const level = targetExercise.level;
  const currentExercises = datasets[category].filter(ex => ex.level === level);
  const currentIndex = currentExercises.findIndex(ex => ex.id === targetExercise.id); 
  const [progress, setProgress] = useState(() => {
    return JSON.parse(localStorage.getItem('progress')) || {};
  });
  
  useEffect(() => {
    let timer = null;
    if (startTime && !isComplete) {
      timer = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isComplete]);

  useEffect(() => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setFadeOutFactoid(false);
    
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  }, [category, currentPart]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isComplete) {
        handleNextExercise();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete]);

  const saveProgress = (id, accuracy, wpm) => {
    const updated = { ...progress, [id]: { accuracy, wpm, completed: true } };
    localStorage.setItem('progress', JSON.stringify(updated));
    setProgress(updated);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
  
    if (!startTime) setStartTime(Date.now());
    const normalize = (str) => str.replace(/['']/g, "'").replace(/[""]/g, '"');

    const normalizedInput = normalize(value.trim());
    const normalizedTarget = normalize(targetExercise.text.trim());

    if (normalizedInput.length >= normalizedTarget.length) {
      setIsComplete(true);
      setFadeOutFactoid(false);
      setTimeout(() => setFadeOutFactoid(true), 4000);

      const accuracy = calculateAccuracy(normalizedInput, normalizedTarget);
      const endTime = Date.now();
      const finalElapsed = (endTime - startTime) / 1000;
      const wpm = calculateWPM(normalizedInput, finalElapsed);
      saveProgress(targetExercise.id, accuracy, wpm);
    }
  };

  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setFadeOutFactoid(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleNextExercise = () => {
    setCurrentPart((prev) => (prev + 1) % datasets[category].length);
  };

  const renderText = () => {
    const normalize = (str) =>
      (str || '').replace(/['']/g, "'").replace(/[""]/g, '"');
  
    const target = normalize(targetExercise.text);
    const typed = normalize(userInput);
  
    const diffs = diffChars(target, typed);
  
    let index = 0;
    return diffs.map((part, i) => {
      const chars = part.value.split('');
      return chars.map((char, j) => {
        const key = `${i}-${j}`;
        let className = 'text-gray-400';
  
        if (part.added) {
          className = 'text-yellow-500';
        } else if (part.removed) {
          className = 'text-red-500';
        } else {
          className = index < typed.length ? 'text-green-600' : 'text-gray-400';
          index++;
        }
        // preserve whitespace using a non-breaking space
        const displayChar = char === ' ' ? '\u00A0' : char;
  
        return (
          <span key={key} className={className}>
            {displayChar}
          </span>
        );
      });
    });
  };

  const sentenceProgressPercent = Math.min((userInput.length / targetExercise.text.length) * 100, 100);
  const stats = [
    { label: 'Accuracy', value: calculateAccuracy(userInput, targetExercise.text) + '%' },
    { label: 'WPM', value: calculateWPM(userInput, elapsedTime) },
    { label: 'Time (s)', value: elapsedTime.toFixed(1) },
  ];

  // Screenshot Feature
  const cardRef = useRef();
  const [imageURL, setImageURL] = useState(null);

  const handleScreenshot = async () => {
    if (!cardRef.current) return null;
    
    try {
      const canvas = await html2canvas(cardRef.current, { useCORS: true });
      const imageUrl = canvas.toDataURL("image/png");
      setImageURL(imageUrl);
      return canvas;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    }
  };

  const shareToSocial = async (platform, wpm, accuracy) => {
    const shareText = `I just scored ${wpm} WPM with ${accuracy}% accuracy on Gutenkeys Typing Tutor! ⌨️🚀`;
    const shareUrl = window.location.href;
    
    // No need to capture screenshot for social sharing
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      default:
        shareScore(wpm, accuracy);
    }
  };

  const shareScore = async (wpm, accuracy) => {
    const shareText = `I just scored ${wpm} WPM with ${accuracy}% accuracy on Gutentype! 🚀`;
    const shareUrl = window.location.href;
    
    // First try to share with Web Share API (Level 2 with files)
    if (navigator.share && navigator.canShare) {
      try {
        const canvas = await handleScreenshot();
        if (!canvas) throw new Error("Could not capture screenshot");
        
        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'typing-score.png', { type: 'image/png' });
        
        // Check if files can be shared
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My Typing Score',
            text: shareText,
            files: [file],
            url: shareUrl,
          });
          return;
        }
      } catch (error) {
        console.log('Error sharing with files, falling back to text:', error);
        // Continue to text-only share if file sharing fails
      }
      
      // Fallback to text-only share
      try {
        await navigator.share({
          title: 'My Typing Score',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log('Error sharing text:', err);
      }
    }
    
    // Fallback for browsers without Web Share API or when sharing is cancelled
    copyToClipboard(shareUrl);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy text: ', err);
          alert('Failed to copy link. Please copy it manually.');
        }
        document.body.removeChild(textarea);
      });
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* TOP CONTROL BAR */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-300 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-2">
              GutenKeys
            </h1>
            <p className="text-sm text-gray-600">Welcome {name}! Culture yourself as you learn to type</p>
          </div>
          
          {/* Category Selection */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['classic', 'pop', 'news', 'stem'].map((mode) => (
              <button 
                key={mode}
                onClick={() => {
                  setCurrentParts((prev) => {
                    const updated = { ...prev, [category]: currentPart };
                    const nextPart = updated[mode] ?? 0;
                    setCurrentPart(nextPart);
                    setCategory(mode);
                    return updated;
                  });
                }}
                className={`px-3 py-2 rounded-lg font-semibold transform transition-all duration-200 ease-in-out text-sm
                  ${
                    category === mode
                      ? 'text-white shadow-md scale-105 ' +
                        (mode === 'classic' ? 'bg-purple-700 hover:bg-purple-800' :
                         mode === 'pop' ? 'bg-pink-500 hover:bg-pink-600' :
                         mode === 'news' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700')
                      : 'bg-gray-200 text-gray-800 hover:bg-yellow-100 hover:shadow-md hover:-translate-y-0.5'
                  }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Progress Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-700 font-semibold">
                Level {targetExercise.level} — Exercise {currentIndex + 1} of {currentExercises.length}
              </p>
            </div>
            
            {/* Progress Dots */}
            <div className="flex gap-1">
              {currentExercises.map((ex, i) => (
                <span
                  key={ex.id}
                  className={`w-2 h-2 rounded-full ${
                    i === currentIndex
                      ? 'bg-yellow-500 scale-125'
                      : progress[ex.id]
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  } transition-transform duration-300`}
                />
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleRestart}
                className="px-3 py-1 text-xs rounded bg-gray-200 font-semibold hover:bg-gray-300 transition-colors"
              >
                Restart
              </button>
              <button
                onClick={handleNextExercise}
                disabled={!isComplete}
                className={`px-3 py-1 text-xs rounded font-semibold transition-colors ${
                  isComplete
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-blue-300 text-white cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TYPING AREA */}
      <div className="flex-grow items-center justify-center p-4">
        <div className="bg-white/60 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-2xl p-6 max-w-4xl w-full mx-auto">
          
          {/* Progress Bar */}
          <div className="h-3 w-full bg-gray-300 rounded mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-yellow-300 transition-all duration-300"
              style={{ width: `${sentenceProgressPercent}%` }}
            />
          </div>

          {/* Text Display */}
          <div className="text-lg sm:text-xl tracking-wide bg-white/80 text-gray-800 p-4 rounded-lg shadow border border-gray-300 font-mono mb-6 min-h-[100px] break-words whitespace-pre-wrap">
            {renderText()}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isComplete}
            placeholder="Start typing here..."
            className="w-full text-lg p-4 text-gray-700 border-2 border-yellow-300 bg-yellow-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />

          {/* Completion Message */}
          {isComplete && (
            <div className="text-center mt-6">
              <div className="text-green-600 text-2xl mb-4 animate-[pop_0.5s_ease-out_forwards]">
                🎉 Exercise Complete!
              </div>
              {console.log({
                name,
                wpm: calculateWPM(userInput, elapsedTime),
                accuracy: calculateAccuracy(userInput, targetExercise.text),
                date: new Date().toLocaleString()
              })}   

             {/* Summary Card  */}  
              <div className="flex mt-4 px-4 py-2 rounded justify-center">
                <SummaryCard
                ref={cardRef}
                name={name}
                wpm={calculateWPM(userInput, elapsedTime)}
                accuracy={calculateAccuracy(userInput, targetExercise.text)}
                date={new Date().toLocaleString()}
                />
              </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                onClick={() => shareToSocial('twitter', calculateWPM(userInput, elapsedTime), calculateAccuracy(userInput, targetExercise.text))}
                className="p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-full transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocial('facebook', calculateWPM(userInput, elapsedTime), calculateAccuracy(userInput, targetExercise.text))}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocial('whatsapp', calculateWPM(userInput, elapsedTime), calculateAccuracy(userInput, targetExercise.text))}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.498 14.382v-.002c-.301-.196-.812-.475-1.35-.69-.18-.072-.384-.148-.4-.156-.06-.025-.1-.04-.143.03-.045.07-.167.24-.205.292-.04.05-.08.057-.15.01-.07-.04-.29-.14-.55-.27-1.2-.58-1.99-1.3-2.22-1.45-.05-.04-.07-.06-.1-.04-.03.02-.04.04-.07.07-.04.04-.16.2-.2.24-.04.05-.08.05-.15.02-.07-.04-.3-.12-.57-.24-1.15-.5-1.9-1.67-1.96-1.75-.06-.08 0-.18.02-.23.02-.04.2-.25.3-.43.1-.16.2-.27.3-.43.1-.16.13-.27.2-.45.07-.18.04-.34-.02-.47-.06-.14-.55-1.32-.76-1.8-.2-.5-.4-.43-.55-.44-.14 0-.3-.01-.46-.01-.16 0-.4.06-.62.28-.22.22-.83.81-.83 1.98 0 1.16.85 2.3.97 2.46.12.16 1.68 2.56 4.07 3.59.56.24.99.39 1.33.5.56.19 1.06.16 1.46.1.45-.07 1.08-.44 1.23-.86.16-.42.16-.78.11-.86-.04-.08-.15-.12-.3-.2zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5c-5.79 0-10.5-4.71-10.5-10.5S6.21 1.5 12 1.5 22.5 6.21 22.5 12 17.79 22.5 12 22.5z" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocial('linkedin', calculateWPM(userInput, elapsedTime), calculateAccuracy(userInput, targetExercise.text))}
                className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
            </div>

            {/* Share Score Button */}
            <button
              onClick={() => shareScore(calculateWPM(userInput, elapsedTime), calculateAccuracy(userInput, targetExercise.text))}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Your Score
            </button>
           {/*  <button
              onClick={handleScreenshot}
              className="px-4 mt-4 py-2 bg-blue-600 text-white rounded"
            >
              Capture Score Screenshot
            </button> */}
            {imageURL && (
              <div className="mt-4">
                <a
                  href={imageURL}
                  download={`Gutenkeys_typing_score_${Date.now()}.png`}
                  className="underline text-blue-500"
                >
                  Download Screenshot
                </a>
              </div>
            )}
              <p className="text-sm text-gray-600 mb-4">Press Enter or click Next to continue</p>
            </div>
          )}
          
          {/* Factoid */}
          {isComplete && targetExercise?.factoid && (
            <div
              className={`mt-6 p-4 text-base font-semibold rounded-lg shadow-md border-2 bg-yellow-100 ${
                category === 'classic' ? 'border-purple-700 text-purple-700' :
                category === 'pop' ? 'border-pink-500 text-pink-500' :
                category === 'news' ? 'border-blue-500 text-blue-500' : 'border-green-600 text-green-600'
              }`}
              style={{
                animation: fadeOutFactoid
                  ? 'fadeOut 0.5s ease-out forwards'
                  : 'fadeSlideIn 0.6s ease-out forwards, pulse 2s ease-in-out 0.8s 3',
              }}
            >
              🌟 Fun Fact: {targetExercise.factoid}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM STATS & ACTIONS */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-gray-300 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Live Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/90 border border-gray-300 rounded-lg p-3 min-w-[100px] shadow-sm">
                <div className="text-xs text-gray-600">{stat.label}</div>
                <div className="text-lg font-bold text-gray-800">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <button
              onClick={onShowStats}
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              View My Stats
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('progress');
                setProgress({});
                setCurrentPart(0);
                setCurrentParts({
                  classic: 0,
                  pop: 0,
                  news: 0,
                  stem: 0
                });
              }}
              className="px-3 py-1 rounded bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors"
            >
              Reset Progress
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('name');
                window.location.reload();
              }}
              className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition-colors"
            >
              Reset Name
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingBox;