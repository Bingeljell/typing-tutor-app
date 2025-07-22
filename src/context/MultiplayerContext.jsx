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
  const [myFinalStats, setMyFinalStats] = useState(null);
  const [opponentFinalStats, setOpponentFinalStats] = useState(null);
  const [myName, setMyName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [pendingConnection, setPendingConnection] = useState(false);
  const [pendingPeerName, setPendingPeerName] = useState('');
  const [isConnectionApproved, setIsConnectionApproved] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const onIncomingConnectionRef = useRef(null);
  const [readyNotification, setReadyNotification] = useState(null);
  const [multiplayerTarget, setMultiplayerTarget] = useState(null);
  const [multiplayerMeta, setMultiplayerMeta] = useState(null); // title + label
  const [isHostUser, setIsHostUser] = useState(false);



  const registerOnIncomingConnection = (callback) => {
    console.log("📡 Host registered onIncomingConnection callback");
    onIncomingConnectionRef.current = callback;
  };

  const signalReady = () => {
    console.log("✅ signalReady() called — sending READY");
    setReady(true);
    if (conn && conn.open) {
      conn.send({ type: 'ready', name: myName }); // send name and ready
      console.log("📣 signalReady() — conn is open, sending READY");
      
    } else {
      console.warn("❌ signalReady() — conn not open, cannot send");
    }
  };

  const signalDone = (stats) => {
    setMyFinalStats(stats);
    if (conn && conn.open) {
      console.log("📤 sending DONE to opponent:", stats);
      conn.send({ type: 'done', stats });
    } else {
      console.warn("❌ Cannot send DONE — no open connection");
    }
    if (opponentFinalStats) {
      decideWinner(stats, opponentFinalStats);
      setGameOver(true);
    }
    console.log('🏁 signalDone called', stats);
  };

  const sendProgress = (progressData) => {
    if (conn && conn.open) {
      console.log("📤 sending progress:", progressData);
      conn.send(progressData);
    } else {
      console.warn("❌ Cannot send progress — no open connection");
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

  useEffect(() => {
    const newPeer = new Peer();
  
    newPeer.on('open', (id) => {
      setPeerId(id);
      setPeer(newPeer);
      console.log("🎉 Host PeerJS ready. My ID is", id);
      setPeerReady(true);
    });
  
    newPeer.on('connection', (connection) => {
      console.log("✅ Host received an incoming connection from", connection.peer);
  
      // ✅ Delay assigning conn until connection is actually open
      connection.on('open', () => {
        console.log("🚀 Host's incoming connection is now open");
        setConn(connection);
        // 👇 TEMP test
        setTimeout(() => {
          console.log("🧪 Host sending handshake TEST message to peer...");
          connection.send({ type: 'debug-test', msg: 'Hello from host' });
        }, 1000);
      });
  
      // ✅ Still listen for data even before open
      connection.on('data', (data) => {
        console.log("📨 Host received data from peer:", data);
  
        if (data?.type === 'ready') {
          console.log("✅ Host received 'ready' from peer");
          setOpponentReady(true);

          if (data.name) {
            setOpponentName(data.name);
            setReadyNotification(`${data.name} is ready`);
            setTimeout(() => setReadyNotification(null), 3000); // Clear after 3 sec
          }  
        } else if (data?.type === 'rematch-request') {
          console.log("🔁 Received rematch request from opponent", data.name);
          resetMatch();
          // Optional: toast or text UI to show rematch incoming
          setReadyNotification(`${data.name} wants a rematch`);
          setTimeout(() => setReadyNotification(null), 3000);
        }
        
        else if (data?.type === 'target') {
          console.log ("🎯 Received target sync from host");
          setMultiplayerTarget(data.value.text);
          setMultiplayerMeta({ author: data.value.author, label: data.value.label });
        } else if (data?.type === 'done') {
          setOpponentFinalStats(data.stats);
          console.log('📩 received done', data.stats);
          if (myFinalStats) {
            decideWinner(myFinalStats, data.stats);
            setGameOver(true);
          } else {
            console.log('⚠️ Opponent finished before me, storing stats');
          }
  
        } else if (data?.type === 'name') {
          setOpponentName(data.value);
          setPendingConnection(true);
          setPendingPeerName(data.value);
          console.log("🚨 Setting host modal with peer name:", data.value);
  
        } else if (data?.type === 'cancel') {
          setGameStarted(false);
  
        } else {
          setOpponentProgress(data); // WPM, accuracy
        }
      });
  
      // Trigger confirmation modal (host-side)
      if (onIncomingConnectionRef.current) {
        console.log("⚡ Triggering onIncomingConnection callback");
        onIncomingConnectionRef.current();
      }
    });
  
    return () => {
      newPeer.destroy();
    };
  }, []);
  

  const connectToPeer = (id, onConnected) => {
    if (!peer) {
      console.warn("❌ PeerJS instance not ready yet");
      return;
    }

    console.log('🧩 connectToPeer called with ID:', id);
    const connection = peer.connect(id);

    connection.on('open', () => {
      console.log("✅ Connection opened with host:", id);
      setConn(connection);
      if (onConnected) onConnected();
      console.log("🎯 Peer is sending name to host:", myName);
      connection.send({ type: 'name', value: myName });
      console.log("✅ Name message sent to host");
    });

    connection.on('data', (data) => {
      console.log("📩 Peer received data:", data);
      if (data?.type === 'ready') {
        console.log("✅ Peer received 'ready' from host");
        setOpponentReady(true);
        if (data.name) {
          setOpponentName(data.name);
          setReadyNotification(`${data.name} is ready`);
          setTimeout(() => setReadyNotification(null), 3000); 
        }
      } else if (data?.type === 'debug-test') {
        console.log("🧪 🧪 PEER received handshake test:", data);
      }

      else if (data?.type === 'rematch-request') {
        console.log("🔁 Received rematch request from opponent", data.name);
        resetMatch();      
        // Optional: toast or text UI to show rematch incoming
        setReadyNotification(`${data.name} wants a rematch`);
        console.log("📢 Showing rematch request notification");
        setTimeout(() => setReadyNotification(null), 3000);
      }
      
      else if (data?.type === 'target') {
        console.log ("🎯 Received target sync from host");
        setMultiplayerTarget(data.value.text);
        setMultiplayerMeta({ author: data.value.author, label: data.value.label });
      } else if (data?.type === 'done') {
        setOpponentFinalStats(data.stats);
        console.log('📩 received done', data.stats);
        if (myFinalStats) {
          decideWinner(myFinalStats, data.stats);
          setGameOver(true);
        } else {
          console.log('⚠️ Opponent finished before me, storing stats');
        }
      } else if (data?.type === 'cancel') {
        setGameStarted(false);
      } else {
        setOpponentProgress(data);
      }
    });

    connection.on('error', (err) => {
      console.error("❌ Error during connection:", err);
    });

    connection.on('close', () => {
      console.warn("🔌 Connection closed by host");
    });

    return connection;
  };

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
        setGameOver,
        youWon,
        registerOnIncomingConnection,
        resetMatch,
        myName,
        setMyName,
        opponentName,
        setOpponentName,
        isConnectionApproved,
        setIsConnectionApproved,
        pendingConnection,
        pendingPeerName,
        setPendingConnection,
        setPendingPeerName,
        peerReady,
        conn,
        myFinalStats,
        opponentFinalStats,
        decideWinner,
        readyNotification,
        setReadyNotification,
        multiplayerTarget,
        setMultiplayerTarget,
        multiplayerMeta,
        setMultiplayerMeta,
        isHostUser,
        setIsHostUser,
        
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
