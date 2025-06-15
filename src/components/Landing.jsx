// src/components/Landing.jsx
const Landing = ({ onStart }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 text-center p-6">
        <h1 className="text-5xl font-bold text-purple-800 mb-4">GutenKeys</h1>
        <p className="text-lg text-gray-700 mb-8">An experiment to culture our youth as they learn how to type.</p>
        <div className="bg-white border border-yellow-200 rounded-lg shadow p-6 max-w-xl mx-auto mt-6 text-left">
          <h3 className="text-2xl font-bold text-purple-700 mb-4">👋 Welcome to the Typing Tutor!</h3>
          <p className="text-gray-700 mb-4">
            Follow these quick tips to get started:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li>
              Choose a <strong>category</strong> you’d like to explore — classic literature, pop culture, science, and more!
            </li>
            <li>
              When you finish typing a sentence, just press <kbd>Enter</kbd> to jump to the next one.
            </li>
            <li>
              Focus on <strong>accuracy</strong> first — speed will follow naturally.
            </li>
            <li>
              Watch for fun facts after each sentence — you might learn something new!
            </li>
          </ul>
        </div>

        <button style={{ marginTop: '2rem' }}
          onClick={onStart}
          className="bg-purple-700 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition"
        >
          Start Typing
        </button>
      </div>
    );
  };
 
export default Landing;
  