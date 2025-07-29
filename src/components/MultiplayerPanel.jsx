import { useState, useEffect } from 'react';
import { useMultiplayer } from '../context/MultiplayerContext';

export default function MultiplayerPanel({ onConnected, onIncomingConnection }) {
  const {
    peerId,
    remotePeerId,
    setRemotePeerId,
    connectToPeer,
    registerOnIncomingConnection,
  } = useMultiplayer();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  console.log("🎯 MultiplayerPanel mounted");
  useEffect(() => {
    if (onIncomingConnection) {
      registerOnIncomingConnection(() => {
        console.log("✅ Incoming connection detected on HOST");
        onIncomingConnection(); // this should trigger room load
      });
    }
  }, [onIncomingConnection]);

  return (
    <div className="bg-white text-red-500 rounded-xl p-4 shadow-md max-w-md mx-auto mt-6 text-center">
      <h2 className="text-xl font-bold mb-2">Multiplayer</h2>

      <div className="mb-4">
      <p className="mb-1 text-sm">Invite your friend with this link:</p>
        <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
          <span className="font-mono text-xs truncate max-w-[200px]">{peerId ? `${window.location.origin}/multiplayer/${peerId}` : 'Loading...'}</span>
          <button
            className="text-blue-500 text-xs ml-2"
            onClick={() => {
              const link = `${window.location.origin}/multiplayer/${peerId}`;
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            disabled={!peerId}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
