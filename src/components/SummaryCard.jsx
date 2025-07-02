import React from "react";

const SummaryCard = React.forwardRef(({ name, wpm, accuracy, date }, ref) => {
  return (
    <div
      ref={ref}
      //className="w-80 p-4 rounded-2xl shadow-lg bg-white text-center border border-gray-300"
      className="w-80 p-4 rounded-2xl shadow-lg bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100 text-center border border-gray-300 text-purple-700 text-base"
    >
      <h2 className="text-xl font-bold mb-2">Typing Results</h2>
      <p className="text-sm mb-1">Name: {name}</p>
      <p className="text-sm mb-1">Date: {date}</p>
      <p className="text-md font-semibold">WPM: {wpm}</p>
      <p className="text-md font-semibold">Accuracy: {accuracy}%</p>
    </div>
  );
});

export default SummaryCard;
