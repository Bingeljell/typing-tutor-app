import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';

const MultiplayerContext = createContext();

export const useMultiplayer = () => useContext(MultiplayerContext);

export const MultiplayerProvider = ({ children }) => {
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [opponentProgress, setOpponentProgress] = useState(null);
  const [ready, setReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [bothReady, setBothReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [youWon, setYouWon] = useState(null);
  const onIncomingConnectionRef = useRef(null);
  const [myName, setMyName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [isConnectionApproved, setIsConnectionApproved] = useState(false);
  const registerOnIncomingConnection = (callback) => {
    console.log("📡 Host registered onIncomingConnection callback");
    onIncomingConnectionRef.current = callback;
  };

  const [myFinalStats, setMyFinalStats] = useState(null);
  const [opponentFinalStats, setOpponentFinalStats] = useState(null);

  const signalReady = () => {
    setReady(true);
    conn?.send({ type: 'ready' });
  };
  
  const signalDone = (stats) => {
    setMyFinalStats(stats); // { wpm, accuracy }
    conn?.send({ type: 'done', stats });
    if (opponentFinalStats) {                      
      decideWinner(stats, opponentFinalStats);
      setGameOver(true);
    }
    console.log('🏁 signalDone called', stats)

  };
  // Initialize PeerJS
  useEffect(() => {
    const newPeer = new Peer();
  
    newPeer.on('open', (id) => {
      setPeerId(id);
      setPeer(newPeer);
      console.log("🎉 Host PeerJS ready. My ID is", id);
    });
    

  
    newPeer.on('connection', (connection) => {
      console.log("✅ Host received an incoming connection from", connection.peer);
      setConn(connection);
      
      if (onIncomingConnectionRef.current) {
        console.log("⚡ Triggering onIncomingConnection callback");
        onIncomingConnectionRef.current(); // ✅ trigger UI switch for host
      }
      connection.on('data', (data) => {
        if (data?.type === 'ready') {
          setOpponentReady(true);
        } else if (data?.type === 'done') {
          setOpponentFinalStats(data.stats);
          console.log('📩 received done', data.stats);
      
            if (myFinalStats) {
              decideWinner(myFinalStats, data.stats);
              setGameOver(true);
          } else if (data?.type === 'name') {
            setOpponentName(data.value);
          } else {
            // I haven’t finished yet — will decide later
            console.log('⚠️ Opponent finished before me, storing stats');
          }
        } else if (data?.type === 'cancel') {
          setGameStarted(false);
        } else {
          setOpponentProgress(data);
        }
      });
      
    });
  
    return () => {
      newPeer.destroy();
    };
  }, []);
  

  const connectToPeer = (id, onConnected) => {
    if (!peer) return;
    console.log('Attempting to connect to:', id);
    const connection = peer.connect(id);
    console.log('Connection established with', id);
    connection.on('open', () => {
      setConn(connection);
      if (onConnected) onConnected(); // ✅ trigger room switch
    });
    connection.send({ type: 'name', value: myName });

    connection.on('data', (data) => {
      if (data?.type === 'ready') {
        setOpponentReady(true);
      } else if (data?.type === 'done') {
        setOpponentFinalStats(data.stats);
    
        if (myFinalStats) {
          decideWinner(myFinalStats, data.stats);
          setGameOver(true);
        } else if (data?.type === 'name') {
          setOpponentName(data.value);
        } else {
          // I haven’t finished yet — will decide later
          console.log('⚠️ Opponent finished before me, storing stats');
        }

      } else if (data?.type === 'cancel') {
        setGameStarted(false);
      } else {
        setOpponentProgress(data);
      }
    });
    
  };

  const sendProgress = (progressData) => {
    if (conn && conn.open) {
      conn.send(progressData);
    }
  };

  const decideWinner = (me, them) => {
    const myScore = me.wpm + me.accuracy;
    const theirScore = them.wpm + them.accuracy;
    console.log("🎯 deciding winner");
    console.log("🧠 My Score:", myScore);
    console.log("🧠 Their Score:", theirScore);
    setYouWon(myScore >= theirScore);
    setGameOver(true);
  };
  
  const resetMatch = () => {
    setGameStarted(false);
    setGameOver(false);
    setYouWon(null);
    setReady(false);
    setOpponentReady(false);
    setBothReady(false);
    setMyFinalStats(null);
    setOpponentFinalStats(null);
    setOpponentProgress(null);
  };
  // Show winning message
  useEffect(() => {
    if (myFinalStats && opponentFinalStats && !gameOver) {
      console.log('🎯 Running decideWinner from useEffect');
      decideWinner(myFinalStats, opponentFinalStats);
      setGameOver(true);
    }
  }, [myFinalStats, opponentFinalStats]);
  

  return (
    <MultiplayerContext.Provider
      value={{
        peerId,
        remotePeerId,
        setRemotePeerId,
        connectToPeer,
        sendProgress,
        opponentProgress,
        signalReady,
        signalDone,
        ready,
        opponentReady,
        bothReady,
        setBothReady,
        gameStarted,
        setGameStarted,
        gameOver,
        youWon,
        registerOnIncomingConnection,
        resetMatch,
        myName,
        setMyName,
        opponentName,
        setOpponentName,
        isConnectionApproved,
        setIsConnectionApproved,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
