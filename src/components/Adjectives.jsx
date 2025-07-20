import React, { useState, useEffect } from "react";
import ikeyoshiData from "../data/ikeyoshi.json";
import nakeyoshiData from "../data/nakeyoshi.json";

const Adjectives = () => {
  const [selectedFiles, setSelectedFiles] = useState([true, false]);
  const [currentItem, setCurrentItem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [visited, setVisited] = useState(new Set());
  const [finished, setFinished] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showFindAnswerButton, setShowFindAnswerButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const getCurrentData = () => {
    let data = [];
    if (selectedFiles[0]) data = [...data, ...ikeyoshiData];
    if (selectedFiles[1]) data = [...data, ...nakeyoshiData];
    return data;
  };

  const getRandomItem = (data) => {
    const unvisitedData = data.filter((item) => !visited.has(item.id));
    if (unvisitedData.length === 0) {
      setFinished(true);
      return null;
    }
    const randomIndex = Math.floor(Math.random() * unvisitedData.length);
    return unvisitedData[randomIndex];
  };

  const startTest = () => {
    if (!selectedFiles[0] && !selectedFiles[1]) {
      setErrorMessage("Please select at least one file.");
      return;
    }

    setVisited(new Set());
    setFinished(false);
    setUserAnswer("");
    setHintVisible(false);
    setTestStarted(true);
    setIncorrectAttempts(0);
    setShowFindAnswerButton(false);
    setErrorMessage("");
    setShowAnswer(false);
    loadNextQuestion();
  };

  const loadNextQuestion = () => {
    const data = getCurrentData();
    const newItem = getRandomItem(data);
    if (newItem) {
      setCurrentItem(newItem);
      setShowAnswer(false);
    }
  };

  const checkAnswer = () => {
    const correctAnswers = reverse
      ? currentItem.jp.split("/")
      : currentItem.eng.split("/");

    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const isCorrect = correctAnswers.some(
      (answer) => answer.toLowerCase().trim() === normalizedAnswer
    );

    if (isCorrect) {
      setVisited((prevVisited) => new Set(prevVisited.add(currentItem.id)));
      setUserAnswer("");
      setHintVisible(false);
      setIncorrectAttempts(0);
      setShowFindAnswerButton(false);
      setShowAnswer(false);
      loadNextQuestion();
    } else {
      setIncorrectAttempts((prevAttempts) => prevAttempts + 1);
      if (incorrectAttempts >= 2) {
        setShowFindAnswerButton(true);
      } else {
        setHintVisible(true);
      }
    }
  };

  const findAnswer = () => {
    setShowAnswer(true);
    setShowFindAnswerButton(false);
    setHintVisible(false);
  };

  const handleCheckboxChange = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = !newSelectedFiles[index];
    if (newSelectedFiles.every((file) => !file)) return;
    setSelectedFiles(newSelectedFiles);
  };

  const totalData = getCurrentData().length;

  useEffect(() => {
    if (testStarted && currentItem === null) {
      loadNextQuestion();
    }
  }, [selectedFiles, testStarted, currentItem]);

  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === "Enter" && testStarted) {
        event.preventDefault();
        checkAnswer();
      }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [testStarted, userAnswer]);

  useEffect(() => {
    if (finished) {
      alert("Congratulations! You've completed the test.");
      window.location.reload();
    }
  }, [finished]);

  return (
    <div className="p-6 w-full mx-auto bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 min-h-screen flex flex-col items-center">
      {/* Control Panel */}
      <div className="bg-indigo-200/40 backdrop-blur-md border border-indigo-300 max-w-3xl rounded-2xl shadow-xl p-8 w-full mb-8 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-900 text-center">
          🧠 Adjective Test
        </h2>

        {errorMessage && (
          <p className="text-center text-red-600 font-semibold">
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="font-semibold text-indigo-900">
              Select Data:
            </label>
            <div className="space-y-2">
              {["I-keyoushi", "Na-keyoushi"].map((label, i) => (
                <label
                  key={i}
                  className="flex items-center space-x-2 text-indigo-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles[i]}
                    onChange={() => handleCheckboxChange(i)}
                    disabled={testStarted}
                    className="accent-indigo-600"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-indigo-900 font-medium">
              Reverse: Show English First
            </span>
            <label className="cursor-pointer">
              <div className="relative inline-block h-8 w-14 rounded-full bg-indigo-200 transition">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={reverse}
                  onChange={() => setReverse(!reverse)}
                />
                <span className="absolute inset-y-0 left-0 m-1 w-6 h-6 rounded-full bg-white shadow-md transition-all peer-checked:left-6 peer-checked:bg-indigo-600"></span>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={startTest}
          className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all"
        >
          Generate Test
        </button>
      </div>

      {/* Quiz Panel */}
      {testStarted && currentItem && (
        <div className="bg-indigo-200/40 backdrop-blur-md border border-indigo-300 max-w-3xl rounded-2xl shadow-xl p-8 w-full space-y-6">
          <div className="text-4xl font-bold text-indigo-900 text-center min-h-[100px] flex items-center justify-center">
            {reverse ? currentItem.eng : currentItem.jp}
          </div>

          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="p-4 border-2 border-indigo-200 rounded-xl bg-white/50 text-indigo-900 text-lg w-full focus:ring-2 focus:ring-indigo-300"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={checkAnswer}
              className="flex-1 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all"
            >
              Submit Answer
            </button>

            {showFindAnswerButton && (
              <button
                onClick={findAnswer}
                className="flex-1 py-3.5 px-6 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-800 font-semibold rounded-xl transition-all"
              >
                Reveal Answer
              </button>
            )}
          </div>

          {hintVisible && (
            <div className="text-center mt-2 text-indigo-700 text-sm italic font-medium">
              Hint: {currentItem.rom}
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            Progress: {visited.size + 1}/{totalData}
          </div>
        </div>
      )}

      {/* Answer Panel */}
      {showAnswer && (
        <div className="mt-8 p-6 min-w-3xl bg-emerald-50/90 border border-emerald-200 rounded-2xl shadow-lg text-center">
          <p className="text-sm font-semibold text-emerald-600 mb-2">
            CORRECT ANSWER
          </p>
          <p className="text-2xl font-medium text-emerald-900">
            {reverse ? currentItem.jp : currentItem.eng}
          </p>
        </div>
      )}
    </div>
  );
};

export default Adjectives;
