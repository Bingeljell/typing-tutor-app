import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatsPage = ({ 
  name 
}) => {
  const navigate = useNavigate();
  const progress = JSON.parse(localStorage.getItem('progress')) || {};

  const entries = Object.entries(progress);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-purple-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">📊 {name}'s Typing Stats</h1>
      <h2 className="text-xl font-semibold mb-4 text-purple-700">Don't forget to take a photo/screen shot and share with your friends!</h2> 

      {entries.length === 0 ? (
        <p className="text-gray-600">No progress yet. Complete an exercise to see stats here!</p>
      ) : (
        <table className="border-collapse w-full max-w-xl bg-white shadow rounded">
          <thead>
            <tr>
              <th className="border p-2 text-left text-purple-700">Exercise ID</th>
              <th className="border p-2 text-purple-700">Accuracy</th>
              <th className="border p-2 text-purple-700">WPM</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([id, data]) => (
              <tr key={id}>
                <td className="border p-2 text-gray-700">{id}</td>
                <td className="border p-2 text-gray-700">{data.accuracy}%</td>
                <td className="border p-2 text-gray-700">{data.wpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        🔙 Back to Typing
      </button>
    </div>
  );
};

export default StatsPage;
