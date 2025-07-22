import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../context/MultiplayerContext';

export default function HostMultiplayerListener() {
  const { registerOnIncomingConnection, peerId } = useMultiplayer();
  const navigate = useNavigate();

  useEffect(() => {
    registerOnIncomingConnection(() => {
      console.log("🚀 Host received connection. Navigating to room...");
      localStorage.setItem('isHost', 'true');
      navigate(`/multiplayer/${peerId}`);
    });
  }, [peerId]);

  return null; // no UI
}
