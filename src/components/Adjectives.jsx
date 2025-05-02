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
    const correctAnswer = reverse ? currentItem.jp : currentItem.eng;
    setUserAnswer(correctAnswer);
    setIncorrectAttempts(0);
    setShowFindAnswerButton(false);
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
    }
  }, [finished]);

  if (finished) {
    return (
      <div>
        <button onClick={startTest}>Retake Test</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Adjective Test</h1>

      {/* Error message if no file is selected */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Checkbox for selecting files */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={selectedFiles[0]}
            onChange={() => handleCheckboxChange(0)}
            disabled={testStarted}
          />
          Ikeyoshi
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedFiles[1]}
            onChange={() => handleCheckboxChange(1)}
            disabled={testStarted}
          />
          Nakeyoshi
        </label>
      </div>

      {/* Checkbox to reverse question/answer */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={reverse}
            onChange={handleReverseChange}
          />
          English to Japanese?
        </label>
      </div>

      {/* Button to generate a random test */}
      <button onClick={startTest}>Generate Test List</button>

      {/* Display the random word/question */}
      {testStarted && currentItem && (
        <h2>{reverse ? currentItem.eng : currentItem.jp}</h2>
      )}

      {/* Conditionally render input box and check answer button */}
      {testStarted && (
        <>
          <input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Your answer"
          />
          <button onClick={checkAnswer}>Check Answer</button>
        </>
      )}

      {/* Hint text if the answer is wrong */}
      {hintVisible && <p>Hint: {currentItem.rom}</p>}

      {/* Show "Find Answer" button after 3 incorrect attempts */}
      {showFindAnswerButton && (
        <button onClick={findAnswer}>Find Answer</button>
      )}
    </div>
  );
};

export default Adjectives;
