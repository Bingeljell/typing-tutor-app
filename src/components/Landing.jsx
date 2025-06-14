// src/components/Landing.jsx
const Landing = ({ onStart }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 text-center p-6">
        <h1 className="text-5xl font-bold text-purple-800 mb-4">GutenKeys</h1>
        <p className="text-lg text-gray-700 mb-8">An experiment to culture our youth as they learn how to type.</p>
        <button
          onClick={onStart}
          className="bg-purple-700 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition"
        >
          Start Typing
        </button>
      </div>
    );
  };
 
export default Landing;
  