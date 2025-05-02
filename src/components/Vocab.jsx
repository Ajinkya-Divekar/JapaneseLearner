import React, { useEffect, useState } from "react";
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
    if (acceptedAnswers.includes(input)) {
      handleNext();
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        setShowAnswer(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleRevealAnswer = () => {
    const answer = reverse
      ? testList[currentIndex].jp
      : testList[currentIndex].eng;
    alert(`Correct Answer: ${answer}`);
    handleNext();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="mb-4">
        <label className="block mb-1 font-bold">Select Card Number:</label>
        <select
          value={selectedCard}
          onChange={(e) => setSelectedCard(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {Array.from({ length: maxCardNumber / 5 }, (_, i) => (
            <option key={(i + 1) * 5} value={(i + 1) * 5}>
              {(i + 1) * 5}
            </option>
          ))}
        </select>
        <button
          onClick={generateTestList}
          className="ml-2 p-2 bg-green-500 text-white rounded"
        >
          Generate List
        </button>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={reverse}
            onChange={(e) => setReverse(e.target.checked)}
          />
          Reverse: Show English first
        </label>
      </div>

      {testStarted &&
        testList.length > 0 &&
        currentIndex !== null &&
        !testComplete && (
          <div className="mb-4">
            <div className="text-2xl mb-2">
              {reverse ? testList[currentIndex].eng : testList[currentIndex].jp}
            </div>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="p-2 border w-full rounded"
              placeholder="Type your answer here"
            />
            <button
              onClick={handleSubmit}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
            {showAnswer && (
              <button
                onClick={handleRevealAnswer}
                className="ml-2 mt-2 p-2 bg-red-500 text-white rounded"
              >
                Find Answer
              </button>
            )}
          </div>
        )}
    </div>
  );
};

export default VocabTest;
