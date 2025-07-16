import React, { useState, useEffect } from "react";
import doushiData from "../data/doushi.json";

const Verb = () => {
  const [selectedForm, setSelectedForm] = useState("jp");
  const [testStarted, setTestStarted] = useState(false);
  const [visited, setVisited] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const getRandomUnvisited = () => {
    const unvisited = doushiData.filter((item) => !visited.includes(item.id));
    if (unvisited.length === 0) return null;
    return unvisited[Math.floor(Math.random() * unvisited.length)];
  };

  const startTest = () => {
    setTestStarted(true);
    setVisited([]);
    setScore(0);
    setAttempts(0);
    setShowAnswer(false);
    const first = getRandomUnvisited();
    setCurrentItem(first);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const getCorrectAnswer = (item) => {
    switch (selectedForm) {
      case "jp":
        return item.jp;
      case "masu":
        return item.masu_form;
      case "te":
        return item.te_form;
      case "eng":
        return item.eng;
      default:
        return "";
    }
  };

  const getPromptWord = (item) => {
    return selectedForm === "eng" ? item.jp : item.eng;
  };

  const handleSubmit = () => {
    if (!currentItem) return;

    const correctAnswer = getCorrectAnswer(currentItem);
    const acceptedAnswers = correctAnswer
      .split("/")
      .map((a) => a.trim().toLowerCase());
    const input = userInput.trim().toLowerCase();

    if (acceptedAnswers.includes(input)) {
      setScore((prev) => prev + 1);
      const newVisited = [...visited, currentItem.id];
      setVisited(newVisited);
      setUserInput("");
      setAttempts(0);
      setShowAnswer(false);

      const next = getRandomUnvisited();
      if (next) {
        setCurrentItem(next);
      } else {
        alert(`Test completed!\nScore: ${score + 1}/${doushiData.length}`);
        setTestStarted(false);
      }
    } else {
      setAttempts((prev) => prev + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="p-6 w-full mx-auto bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 min-h-screen flex flex-col items-center">
      <div className="bg-indigo-200/40 backdrop-blur-md border border-indigo-300 max-w-3xl rounded-2xl shadow-xl p-8 w-full mb-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-extrabold text-indigo-800">
            📝 Verb Conjugation Test
          </h1>

          {/* Form selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "masu", label: "Masu-form" },
              { value: "te", label: "Te-form" },
              { value: "jp", label: "Dictionary (JP)" },
              { value: "eng", label: "English" },
            ].map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-white border border-indigo-300 hover:border-indigo-500 shadow-sm hover:shadow-md transition"
              >
                <input
                  type="radio"
                  name="form"
                  value={value}
                  checked={selectedForm === value}
                  onChange={(e) => setSelectedForm(e.target.value)}
                  className="hidden peer"
                />
                <span className="w-5 h-5 border-2 border-indigo-500 rounded-full flex items-center justify-center text-transparent peer-checked:bg-indigo-500 peer-checked:text-white peer-checked:border-indigo-600 transition-colors">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-indigo-900">
                  {label}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={startTest}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all mt-4"
          >
            Generate Test
          </button>
        </div>
      </div>

      {/* Quiz Panel */}
      {testStarted && currentItem && (
        <div className="bg-indigo-200/40 backdrop-blur-md border border-indigo-300 max-w-3xl rounded-2xl shadow-xl p-8 w-full space-y-6">
          <div className="text-4xl font-bold text-indigo-900 text-center min-h-[120px] flex items-center justify-center">
            {getPromptWord(currentItem)}
          </div>

          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="p-4 border-2 border-indigo-200 rounded-xl bg-white/50 text-indigo-900 text-lg w-full focus:ring-2 focus:ring-indigo-300"
            placeholder="Type your answer here..."
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all"
            >
              Submit Answer
            </button>

            {attempts >= 3 && !showAnswer && (
              <button
                onClick={() => {
                  if (score > 0) setScore((prev) => prev - 1);
                  setShowAnswer(true);
                }}
                className="flex-1 py-3.5 px-6 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-800 font-semibold rounded-xl transition-all"
              >
                Reveal Answer
              </button>
            )}
          </div>

          {attempts > 0 && !showAnswer && (
            <div className="text-center mt-2 text-red-600 text-sm font-medium">
              Incorrect. Try again!
            </div>
          )}

          {showAnswer && (
            <div className="mt-8 p-6 w-full bg-emerald-50/90 border border-emerald-200 rounded-2xl shadow-lg text-center">
              <p className="text-sm font-semibold text-emerald-600 mb-2">
                CORRECT ANSWER
              </p>
              <p className="text-2xl font-medium text-emerald-900">
                {getCorrectAnswer(currentItem)}
              </p>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            Progress: {visited.length}/{doushiData.length} | Score: {score}
          </div>
        </div>
      )}
    </div>
  );
};

export default Verb;
