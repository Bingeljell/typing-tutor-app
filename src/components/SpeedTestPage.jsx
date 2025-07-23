import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { calculateAccuracy, calculateWPM } from '../utils/typingUtils';
import { motion } from 'framer-motion';
import { diffChars } from 'diff';
import classic from '../data/exercises_classics';
import pop from '../data/exercises_pop';
import news from '../data/exercises_news';
import stem from '../data/exercises_stem';
import html2canvas from "html2canvas";
import SummaryCard from "./SummaryCard";

const SpeedTestPage = ({ onComplete, name }) => {

  // Pick a category at random
  const timeTrialPool = [
    ...classic,
    ...pop,
    ...news,
    ...stem
  ];
  


  const [target, setTarget] = useState('');
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * timeTrialPool.length);
    setTarget(timeTrialPool[randomIndex].text);
  }, []);

  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [imageURL, setImageURL] = useState(null);
  const cardRef = useRef();

  useEffect(() => {
    let timer;
    if (startTime && !isComplete) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        setElapsedTime(elapsed);
        setTimeLeft(30 - Math.floor(elapsed));
        if (elapsed >= 30) {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [startTime, isComplete]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  useEffect(() => {
    if (timeTrialPool.length > 0) {
      setTarget(timeTrialPool[currentExerciseIndex].text);
    }
  }, [currentExerciseIndex]);

  // Track input against target for accuracy 

  const renderText = () => {
    const normalize = (str) => str.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
    const targetNorm = normalize(target);
    const inputNorm = normalize(input);
  
    const diffs = diffChars(targetNorm, inputNorm);
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
          className = index < inputNorm.length ? 'text-green-600' : 'text-gray-400';
          index++;
        }
  
        return (
          <span key={key} className={className}>
            {char}
          </span>
        );
      });
    });
  };
const [cumulativeInput, setCumulativeInput] = useState('');
const [cumulativeTarget, setCumulativeTarget] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!startTime) setStartTime(Date.now());

    if (value.length >= target.length) {
      // move to next exercise
      const nextIndex = currentExerciseIndex + 1;
    
      // accumulate
      setCumulativeInput((prev) => prev + input);   // add user typed text
      setCumulativeTarget((prev) => prev + target); // add the correct text
    
      if (nextIndex < timeTrialPool.length) {
        setCurrentExerciseIndex(nextIndex);
        setInput('');
      } else {
        setCurrentExerciseIndex(0);
        setInput('');
      }
    }
  };
  const restartTimeTrial = () => {
    const randomIndex = Math.floor(Math.random() * timeTrialPool.length);  // define here
    setInput('');
    setCumulativeInput('');
    setCumulativeTarget('');
    setCurrentExerciseIndex(randomIndex);
    setTarget(timeTrialPool[randomIndex].text);
    setElapsedTime(0);
    setTimeLeft(60);
    setIsComplete(false);
    setStartTime(null);
  };

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

  const accuracy = calculateAccuracy(cumulativeInput, cumulativeTarget);
  const wpm = calculateWPM(cumulativeInput, elapsedTime);

  const shareToSocial = async (platform, wpm, accuracy) => {
    const shareText = `I just scored ${wpm} WPM with ${accuracy}% accuracy on Gutenkeys Typing Tutor! ⌨️🚀`;
    const shareUrl = window.location.href;
    
    // No need to capture screenshot for social sharing
    
    switch(platform) {
      case 'twitter':
        try {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        } catch (e) {
          console.error("Could not open Window", e);
        }
        break;
      case 'facebook':
        try {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        } catch (e) {
          console.error("Could not open Window", e);
        }
        break;
      case 'whatsapp':
        try {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        } catch (e) {
            console.error("Could not open Window", e);
        }
        break;
      case 'linkedin':
        try {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        } catch (e) {
          console.error("Could not open Window", e);
        }
        break;
      default:
        shareScore(wpm, accuracy);
    }
  };

  const shareScore = async (wpm, accuracy) => {
    const shareText = `I just scored ${wpm} WPM with ${accuracy}% accuracy on Gutenkeys Typing Tutor! ⌨️ 🚀`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Typing Score',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
    
    // Fallback for browsers without Web Share API
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

  // Debugging for /solo issue
  console.log('[SpeedTestPage] Mounted');
  useEffect(() => {
    console.log('[SpeedTestPage] useEffect — target:', target);
  }, [target]);
  const location = useLocation();
  console.log('[SpeedTestPage] Current route:', location.pathname);
  useEffect(() => {
    console.log('[SpeedTestPage] isComplete changed:', isComplete);
  }, [isComplete]);


  // End debugging



  // Load the page
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-purple-100 to-pink-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-lg border rounded-xl shadow p-8 text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">⚡ Time Trial ⚡</h1>
        <p className="mb-2 text-gray-700 font-semibold">Welcome, {name}!</p>
        <p className="mb-4 text-gray-600">Type the sentence below as fast and accurately as you can:</p>
        <p className="text-xl font-semibold text-purple-700 mb-2">
          Time Left: {timeLeft}s
        </p>
        {/* <p className="mb-4 text-lg font-mono bg-gray-100 p-2 text-gray-700 rounded">{target}</p> */}
        <div className="relative overflow-hidden min-h-[200px] w-full h-24 bg-gray-100 rounded mb-4 border max-w-5xl">
          <div
            className="absolute whitespace-pre-wrap transition-transform"
            style={{ transform: `translateY(-${input.length * 0.1}px)` }} // Vertical scroll and speed control
          >
            {renderText()}
          </div>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          disabled={isComplete}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={() => (window.location.href = '/')}
          className="mb-4 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white px-6 py-2 rounded shadow hover:brightness-110 transition-all duration-300 font-semibold text-base"
        >
          Back to Main
        </button>
        {isComplete && (
          <div className="mt-4 mb-4">
            <p className="text-green-700 font-bold">✅ Time Trial Complete!</p>
            <p className="text-gray-600">Challenge your friends to a Type-off!</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 shadow w-32">
                <div className="text-sm text-purple-700">Accuracy</div>
                <div className="text-2xl font-bold text-purple-900">{accuracy}%</div>
              </div>
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 shadow w-32">
                <div className="text-sm text-blue-700">WPM</div>
                <div className="text-2xl font-bold text-blue-900">{wpm}</div>
              </div>
            </div>
            <div ref={cardRef} className="flex justify-center w-full max-w-md mx-auto mt-4">
              <SummaryCard
                name={name}
                wpm={calculateWPM(input, elapsedTime)}
                accuracy={calculateAccuracy(input, target)}
                date={new Date().toLocaleString()}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                onClick={() => shareToSocial('twitter', wpm, accuracy)}
                className="p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-full transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocial('facebook', wpm, accuracy)}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocial('whatsapp', wpm, accuracy)}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.498 14.382v-.002c-.301-.196-.812-.475-1.35-.69-.18-.072-.384-.148-.4-.156-.06-.025-.1-.04-.143.03-.045.07-.167.24-.205.292-.04.05-.08.057-.15.01-.07-.04-.29-.14-.55-.27-1.2-.58-1.99-1.3-2.22-1.45-.05-.04-.07-.06-.1-.04-.03.02-.04.04-.07.07-.04.04-.16.2-.2.24-.04.05-.08.05-.15.02-.07-.04-.3-.12-.57-.24-1.15-.5-1.9-1.67-1.96-1.75-.06-.08 0-.18.02-.23.02-.04.2-.25.3-.43.1-.16.2-.27.3-.43.1-.16.13-.27.2-.45.07-.18.04-.34-.02-.47-.06-.14-.55-1.32-.76-1.8-.2-.5-.4-.43-.55-.44-.14 0-.3-.01-.46-.01-.16 0-.4.06-.62.28-.22.22-.83.81-.83 1.98 0 1.16.85 2.3.97 2.46.12.16 1.68 2.56 4.07 3.59.56.24.99.39 1.33.5.56.19 1.06.16 1.46.1.45-.07 1.08-.44 1.23-.86.16-.42.16-.78.11-.86-.04-.08-.15-.12-.3-.2zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5c-5.79 0-10.5-4.71-10.5-10.5S6.21 1.5 12 1.5 22.5 6.21 22.5 12 17.79 22.5 12 22.5z" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocial('linkedin', wpm, accuracy)}
                className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
            </div>

            <div className="flex mt-4 px-4 py-2 rounded justify-center">
            <button
              onClick={handleScreenshot}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Capture & Share
            </button>
            </div>
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
            <button
              onClick={restartTimeTrial}
              className="mt-4 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold text-lg"
            >
              Restart Time Trial
            </button>
            <button
              onClick={onComplete}
              className="mt-4 bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 text-white px-8 py-3 rounded-full shadow-md hover:brightness-105 transition-all duration-300 font-semibold text-lg"
            >
              Continue to Typing Adventure
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SpeedTestPage;
