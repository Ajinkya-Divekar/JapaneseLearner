import React, { useState } from "react";
import vocabList from "../data/vocab.json";

const VocabTest = () => {
  const [selectedCard, setSelectedCard] = useState(1);
  const [testList, setTestList] = useState([]);
  const [visited, setVisited] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  // Find maximum card number and round it up to the nearest multiple of 5
  const maxCardNumber =
    Math.ceil(Math.max(...vocabList.map((entry) => entry.card)) / 5) * 5;

  const generateTestList = () => {
    const filtered = vocabList.filter((entry) => entry.card <= selectedCard);
    setTestList(filtered);
    resetTest(filtered);
    setTestStarted(true);
    setTestComplete(false);
  };

  const resetTest = (list) => {
    const randIdx = Math.floor(Math.random() * list.length);
    setCurrentIndex(randIdx);
    setVisited([randIdx]);
    setUserInput("");
    setAttempts(0);
    setShowAnswer(false);
  };

  const handleNext = () => {
    const available = testList
      .map((_, i) => i)
      .filter((i) => !visited.includes(i));
    if (available.length === 0) {
      alert("Test complete!");
      setTestComplete(true);
      return;
    }
    const nextIdx = available[Math.floor(Math.random() * available.length)];
    setCurrentIndex(nextIdx);
    setVisited([...visited, nextIdx]);
    setUserInput("");
    setAttempts(0);
    setShowAnswer(false);
  };

  const handleSubmit = () => {
    if (!testList[currentIndex]) return;

    const answer = reverse
      ? testList[currentIndex].jp
      : testList[currentIndex].eng;
    const acceptedAnswers = answer
      .split("/")
      .map((a) => a.trim().toLowerCase());
    const input = userInput.trim().toLowerCase();

    // Check if the answer is correct
    if (acceptedAnswers.includes(input)) {
      setAttempts(0); // Reset attempts on correct answer
      handleNext();
    } else {
      setAttempts((prev) => prev + 1);
      if (attempts >= 2) {
        setShowAnswer(true); // Show answer after 2 wrong attempts
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-br from-indigo-50 to-indigo-100 min-h-screen flex flex-col items-center">
      {/* Control Section */}
      <div className="backdrop-blur-lg bg-white/30 border border-white/50 rounded-2xl shadow-xl p-8 w-full mb-8 space-y-6">
        {/* Card Selection Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <h2 className="text-xl font-bold text-indigo-900 whitespace-nowrap">
            Select Card Number:
          </h2>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(Number(e.target.value))}
              className="p-2.5 border-2 border-indigo-200 rounded-xl bg-white/50 text-indigo-900 w-full md:w-48 focus:ring-2 focus:ring-indigo-300"
            >
              {Array.from({ length: maxCardNumber / 5 }, (_, i) => (
                <option key={(i + 1) * 5} value={(i + 1) * 5}>
                  {(i + 1) * 5}
                </option>
              ))}
            </select>
            <button
              onClick={generateTestList}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap w-full md:w-auto"
            >
              Generate List
            </button>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg">
          <span className="text-lg text-indigo-900 font-medium">
            Reverse: Show English first
          </span>
          <label className="cursor-pointer">
            <div className="relative inline-block h-8 w-14 rounded-full bg-indigo-200 transition [-webkit-tap-highlight-color:transparent]">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={reverse}
                onChange={(e) => setReverse(e.target.checked)}
              />
              <span className="absolute inset-y-0 left-0 m-1 w-6 h-6 rounded-full bg-white shadow-md transition-all peer-checked:left-6 peer-checked:bg-indigo-600"></span>
            </div>
          </label>
        </div>
      </div>

      {/* Test Section */}
      {testStarted &&
        testList.length > 0 &&
        currentIndex !== null &&
        !testComplete && (
          <div className="backdrop-blur-lg bg-white/30 border border-white/50 rounded-2xl shadow-xl p-8 w-full space-y-6">
            <div className="text-4xl font-bold text-indigo-900 text-center min-h-[120px] flex items-center justify-center">
              {reverse ? testList[currentIndex].eng : testList[currentIndex].jp}
            </div>

            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="p-4 border-2 border-indigo-200 rounded-xl bg-white/50 text-indigo-900 text-lg w-full focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              placeholder="Type your answer here..."
            />

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleSubmit}
                className="py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}

      {/* Answer Display */}
      {showAnswer && (
        <div className="mt-8 p-6 w-full bg-emerald-50/90 border border-emerald-200 rounded-2xl shadow-lg text-center animate-fade-in">
          <p className="text-sm font-semibold text-emerald-600 mb-2">
            CORRECT ANSWER
          </p>
          <p className="text-2xl font-medium text-emerald-900">
            {reverse ? testList[currentIndex].jp : testList[currentIndex].eng}
          </p>
        </div>
      )}
    </div>
  );
};

export default VocabTest;
