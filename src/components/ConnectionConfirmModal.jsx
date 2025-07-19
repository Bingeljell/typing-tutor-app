import React from 'react';

export default function ConnectionConfirmModal({ myName, opponentName, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-purple-700">👥 Confirm Match</h2>
        <p className="text-gray-700 mb-2">You (<strong>{myName}</strong>) are connecting with:</p>
        <p className="text-lg font-semibold text-pink-600 mb-4">{opponentName || 'Waiting...'}</p>
        <button
          onClick={onConfirm}
          className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-6 py-2 rounded-full shadow hover:brightness-110 transition-all"
        >
          ✅ Confirm & Start
        </button>
      </div>
    </div>
  );
}
