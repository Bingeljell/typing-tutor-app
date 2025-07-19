import React from 'react';

export default function HostMatchRequestModal({ peerName, onAccept, onDecline }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl text-center max-w-sm w-full">
        <h2 className="text-xl font-bold text-purple-700 mb-2">🚨 Match Request</h2>
        <p className="text-gray-700 mb-4">
          <strong>{peerName || 'Someone'}</strong> wants to join your typing race!
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onDecline}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded"
          >
            Accept & Start
          </button>
        </div>
      </div>
    </div>
  );
}
