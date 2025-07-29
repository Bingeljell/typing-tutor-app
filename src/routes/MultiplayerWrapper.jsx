// src/components/MultiplayerWrapper.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';    // ← added useNavigate
import { useMultiplayer } from '../context/MultiplayerContext';
import MultiplayerRoom from '../components/MultiplayerRoom';
import ConnectionConfirmModal from '../components/ConnectionConfirmModal';

export default function MultiplayerWrapper() {
  // 1) Rename the URL param so it won't collide with context.peerId
  const { peerId: routePeerId } = useParams();                  // ← renamed
  const navigate = useNavigate();                               // ← imported & initialized

  // 2) Grab stored name & sync it into context
  const [localName, setLocalName] = useState(
    localStorage.getItem('name') || ''
  );
  
  const {
    peerId: myPeerId,          // ← your own PeerJS ID
    peerReady,                 // ← only true once PeerJS is open
    connectToPeer,
    opponentName,
    isConnectionApproved,
    setIsConnectionApproved,
    myName,
    setMyName,
    isHostUser,
    setIsHostUser,
  } = useMultiplayer();

  // 3) Ensure we always have a name before proceeding
  useEffect(() => {
    if (!localName.trim()) {
      const userName = prompt("Enter your name to join the match:");
      if (userName?.trim()) {
        localStorage.setItem('name', userName);
        setLocalName(userName);
        setMyName(userName);
      }
    } else {
      setMyName(localName);
    }
  }, [localName, setMyName]);

  // 4) Compute Host vs Peer fresh **every** time PeerJS is ready
  useEffect(() => {
    if (!peerReady) return;

    // Host if there's NO routePeerId, or it exactly matches us
    const amHost = !routePeerId || routePeerId === myPeerId;
    setIsHostUser(amHost);
    console.log("🧭 Role determined fresh:", amHost ? "Host" : "Peer");
  }, [peerReady, routePeerId, myPeerId, setIsHostUser]);       // :contentReference[oaicite:1]{index=1}

  // 5) Only Peers should auto‐connect to the host
  useEffect(() => {
    if (
      peerReady &&
      !isHostUser &&
      myName.trim() &&
      routePeerId
    ) {
      console.log("🧩 Peer attempting to connect to host:", routePeerId);
      connectToPeer(routePeerId, () => {
        console.log("✅ Connected to host via URL");
      });
    }
  }, [peerReady, isHostUser, myName, routePeerId, connectToPeer]);

  // 6) If the other side hasn't approved, show the confirm modal
  if (!isConnectionApproved) {
    return (
      <ConnectionConfirmModal
        myName={localName}
        opponentName={opponentName}
        onConfirm={() => setIsConnectionApproved(true)}
      />
    );
  }

  // 7) Hold off on mounting the room until PeerJS is initialized
  if (!peerReady) {
    return (
      <div className="p-4 text-center">
        Initializing multiplayer… please wait.
      </div>
    );
  }

  // 8) Finally render the fully-ready room
  return (
    <MultiplayerRoom
      name={localName}
      onComplete={() => navigate('/')}
    />
  );
}
