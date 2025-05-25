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

  // Merging data from selected files
  const getCurrentData = () => {
    let data = [];
    if (selectedFiles[0]) data = [...data, ...ikeyoshiData];
    if (selectedFiles[1]) data = [...data, ...nakeyoshiData];
    return data;
  };

  // Get a random item from the available data
  const getRandomItem = (data) => {
    const unvisitedData = data.filter((item) => !visited.has(item.id));
    if (unvisitedData.length === 0) {
      setFinished(true); // All questions have been answered
      return null;
    }
    const randomIndex = Math.floor(Math.random() * unvisitedData.length);
    return unvisitedData[randomIndex];
  };

  // Start new test
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
    loadNextQuestion();
  };

  // Load the next question
  const loadNextQuestion = () => {
    const data = getCurrentData();
    const newItem = getRandomItem(data);
    if (newItem) {
      setCurrentItem(newItem);
      setShowAnswer(false); // reset answer display
    }
  };

  // Handle checking the user's answer
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
      setShowAnswer(false); // reset this
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

  // Handle "Find Answer" button click
  const findAnswer = () => {
    setShowAnswer(true);
    setShowFindAnswerButton(false);
    setHintVisible(false);
  };

  // Handle checkbox selection (which files to include)
  const handleCheckboxChange = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = !newSelectedFiles[index];
    if (newSelectedFiles.every((file) => !file)) return; // Prevent unchecking both checkboxes
    setSelectedFiles(newSelectedFiles);
  };

  // Handle reverse question/answer checkbox
  const handleReverseChange = () => {
    setReverse((prevReverse) => !prevReverse);
  };

  // Handle user input
  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
  };

  // Effect hook to load next question when selected files change
  useEffect(() => {
    if (testStarted && currentItem === null) {
      loadNextQuestion();
    }
  }, [selectedFiles, testStarted, currentItem]);

  // Detect Enter key press to trigger check answer
  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === "Enter" && testStarted) {
        event.preventDefault();
        checkAnswer();
      }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => {
      window.removeEventListener("keydown", handleEnterKey);
    };
  }, [testStarted, userAnswer]);

  // Show alert at the end of the test
  useEffect(() => {
    if (finished) {
      alert("Congratulations! You've completed the test.");
      window.location.reload();
    }
  }, [finished]);

  const totalData = getCurrentData().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 flex items-center flex-col p-6">
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-800">
          Adjective Test
        </h1>

        {errorMessage && (
          <p className="text-red-600 font-semibold mb-4 text-center">
            {errorMessage}
          </p>
        )}

        {/* Top controls: File selection + Reverse option */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-yellow-900 font-semibold text-lg mb-4">
              Select Files
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedFiles[0]}
                  onChange={() => handleCheckboxChange(0)}
                  disabled={testStarted}
                  className="accent-yellow-500 w-5 h-5 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
                />
                <label className="text-yellow-900 font-medium text-lg">
                  Ikeyoshi
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedFiles[1]}
                  onChange={() => handleCheckboxChange(1)}
                  disabled={testStarted}
                  className="accent-yellow-500 w-5 h-5 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
                />
                <label className="text-yellow-900 font-medium text-lg">
                  Nakeyoshi
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center md:justify-end mt-6 md:mt-0 space-x-3">
            <input
              type="checkbox"
              checked={reverse}
              onChange={handleReverseChange}
              className="accent-yellow-500 w-5 h-5 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
            />
            <label className="text-yellow-800 font-medium text-lg">
              English to Japanese?
            </label>
          </div>
        </div>

        {/* Generate Test Button */}
        <button
          onClick={startTest}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-md transition mb-6"
        >
          Generate Test List
        </button>

        {/* Display the word/question */}
        {testStarted && currentItem && (
          <h2 className="text-3xl font-semibold text-center text-yellow-900 mb-6">
            {reverse ? currentItem.eng : currentItem.jp}
          </h2>
        )}

        {/* Input + Check button */}
        {testStarted && (
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={handleInputChange}
              placeholder="Your answer"
              className="w-full p-3 border border-yellow-300 rounded-md text-lg"
            />
            <button
              onClick={checkAnswer}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Check Answer
            </button>
            <div className="text-center text-sm text-gray-500">
              Progress: {visited.size + 1}/{totalData}
            </div>
          </div>
        )}

        {/* Hint */}
        {hintVisible && (
          <p className="mt-6 text-center text-sm text-gray-700 italic">
            Hint: <span className="font-medium">{currentItem.rom}</span>
          </p>
        )}

        {/* Find Answer */}
        {showFindAnswerButton && (
          <div className="mt-6 text-center">
            <button
              onClick={findAnswer}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Find Answer
            </button>
          </div>
        )}

        {showAnswer && (
          <div className="mt-8 p-6 w-full bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 border border-yellow-300 rounded-2xl shadow-lg text-center">
            <p className="text-sm font-semibold text-yellow-600 mb-2">
              CORRECT ANSWER
            </p>
            <p className="text-2xl font-medium text-yellow-800">
              {reverse ? currentItem.jp : currentItem.eng}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Adjectives;
