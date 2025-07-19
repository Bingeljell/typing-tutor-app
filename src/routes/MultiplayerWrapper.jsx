import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMultiplayer } from '../context/MultiplayerContext';
import MultiplayerRoom from '../components/MultiplayerRoom';
import ConnectionConfirmModal from '../components/ConnectionConfirmModal';

export default function MultiplayerWrapper() {
  const { peerId } = useParams();
  const [localName, setLocalName] = useState(localStorage.getItem('name') || '');
  const {
    connectToPeer,
    opponentName,
    isConnectionApproved,
    setIsConnectionApproved,
    myName,
    setMyName,
    peerReady,
    
  } = useMultiplayer();

  useEffect(() => {
    // If name isn't set yet, ask and store it
    if (!localName.trim()) {
      const userName = prompt("Enter your name to join the match:");
      if (!userName) return;
      localStorage.setItem('name', userName);
      setLocalName(userName);
      setMyName(userName);
    } else {
      setMyName(localName);
    }
  }, [localName]);

  useEffect(() => {
    if (peerId && myName && peerReady) {
      console.log("🧩 Peer attempting to connect to host with ID:", peerId);
      connectToPeer(peerId, () => {
        console.log("✅ Connected to host via URL");
      });
    }
  }, [peerId, myName, peerReady]);

  if (!isConnectionApproved) {
    return (
      <ConnectionConfirmModal
        myName={localName}
        opponentName={opponentName}
        onConfirm={() => setIsConnectionApproved(true)}
      />
    );
  }

  return <MultiplayerRoom name={localName} onComplete={() => window.location.href = '/'} />;
}
