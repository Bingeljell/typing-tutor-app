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
        <p className="mb-1 text-sm">Your Room Code:</p>
        <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
          <span className="font-mono text-sm">{peerId || 'Loading...'}</span>
          <button
            className="text-blue-500 text-xs ml-2"
            onClick={handleCopy}
            disabled={!peerId}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter friend's code"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          className="border px-2 py-1 rounded w-full text-sm"
        />
        <button
          onClick={() => {
            setTimeout(() => {
              connectToPeer(remotePeerId, onConnected);
            }, 500);
          }}
          className="bg-blue-500 text-white px-4 py-1 mt-2 rounded text-sm hover:bg-blue-600"
        >
          Join Game
        </button>
      </div>
    </div>
  );
}
