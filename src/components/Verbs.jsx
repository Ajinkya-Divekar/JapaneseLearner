import React, { useState, useEffect } from "react";
import doushiData from "../data/doushi.json";

const Verb = () => {
  const [selectedForms, setSelectedForms] = useState({
    jp: true,
    masu: false,
    te: false,
    eng: false,
  });
  const [currentItem, setCurrentItem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [visited, setVisited] = useState(new Set());
  const [finished, setFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showFindAnswerButton, setShowFindAnswerButton] = useState(false);

  // Get random unvisited item
  const getRandomItem = () => {
    const unvisited = doushiData.filter((item) => !visited.has(item.id));
    if (unvisited.length === 0) {
      setFinished(true);
      return null;
    }
    const randIndex = Math.floor(Math.random() * unvisited.length);
    return unvisited[randIndex];
  };

  // Start the test by selecting a random verb
  const startTest = () => {
    const newItem = getRandomItem();
    if (!newItem) {
      setFinished(true);
      return;
    }

    setCurrentItem(newItem);
    setVisited(new Set());
    setFinished(false);
    setUserAnswer("");
    setHintVisible(false);
    setTestStarted(true);
    setIncorrectAttempts(0);
    setShowFindAnswerButton(false);
  };

  // Load the next random verb question
  const loadNextQuestion = () => {
    const nextItem = getRandomItem();
    if (nextItem) {
      setCurrentItem(nextItem);
      setUserAnswer("");
      setHintVisible(false);
      setIncorrectAttempts(0);
      setShowFindAnswerButton(false);
    }
  };

  // Check if the user's answer is correct
  const checkAnswer = () => {
    let correctAnswer = null;

    // Find the correct answer based on selected forms
    if (selectedForms.jp) correctAnswer = currentItem.jp;
    if (selectedForms.masu) correctAnswer = currentItem.masu_form;
    if (selectedForms.te) correctAnswer = currentItem.te_form;
    if (selectedForms.eng) correctAnswer = currentItem.eng;

    if (!correctAnswer) {
      console.warn("No valid answer for selected form.");
      return;
    }

    const normalized = userAnswer.toLowerCase().trim();
    if (normalized === correctAnswer.toLowerCase().trim()) {
      setVisited((prev) => new Set(prev).add(currentItem.id));
      loadNextQuestion();
    } else {
      setIncorrectAttempts((prev) => prev + 1);
      setHintVisible(true);
      if (incorrectAttempts >= 2) {
        setShowFindAnswerButton(true);
      }
    }
  };

  // Reveal the correct answer when "Find Answer" is clicked
  const findAnswer = () => {
    const correctAnswer = selectedForms.jp
      ? currentItem.jp
      : selectedForms.masu
      ? currentItem.masu_form
      : selectedForms.te
      ? currentItem.te_form
      : currentItem.eng;

    setUserAnswer(correctAnswer);
    setIncorrectAttempts(0);
    setShowFindAnswerButton(false);
  };

  // Handle user input change
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  // Handle checkbox selection for forms
  const handleFormSelect = (e) => {
    const { name, checked } = e.target;
    setSelectedForms((prevSelectedForms) => ({
      ...prevSelectedForms,
      [name]: checked,
    }));
  };

  // Start new test on page load if no item is selected
  useEffect(() => {
    if (testStarted && currentItem === null) {
      loadNextQuestion();
    }
  }, [testStarted, currentItem]);

  // Handle the Enter key press to submit the answer
  useEffect(() => {
    const onEnter = (e) => {
      if (e.key === "Enter" && testStarted) {
        e.preventDefault();
        checkAnswer();
      }
    };
    window.addEventListener("keydown", onEnter);
    return () => window.removeEventListener("keydown", onEnter);
  }, [testStarted, userAnswer, incorrectAttempts]);

  // Display success alert when the test is finished
  useEffect(() => {
    if (finished) {
      // Minimizing alert usage
      alert("Congratulations! You've completed the test.");
      setUserAnswer("");
    }
  }, [finished]);

  return (
    <div>
      <h1>Verb Test</h1>

      {/* Checkbox for selecting verb forms */}
      <div>
        <label>
          <input
            type="checkbox"
            name="masu"
            checked={selectedForms.masu}
            onChange={handleFormSelect}
          />
          Masu-form
        </label>
        <label>
          <input
            type="checkbox"
            name="te"
            checked={selectedForms.te}
            onChange={handleFormSelect}
          />
          Te-form
        </label>
        <label>
          <input
            type="checkbox"
            name="jp"
            checked={selectedForms.jp}
            onChange={handleFormSelect}
          />
          Dictionary-form (JP)
        </label>
        <label>
          <input
            type="checkbox"
            name="eng"
            checked={selectedForms.eng}
            onChange={handleFormSelect}
          />
          English meaning
        </label>
      </div>

      {/* Button to generate test */}
      <button onClick={startTest}>Generate Test</button>

      {/* Test interface */}
      {testStarted && currentItem && (
        <div>
          <h2>
            {selectedForms.eng
              ? currentItem.jp
              : selectedForms.jp
              ? currentItem.eng
              : currentItem.eng}
          </h2>

          <input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Your answer"
          />
          <button onClick={checkAnswer}>Check Answer</button>

          {/* Hint and Find Answer buttons */}
          {hintVisible && (
            <div>
              <p>Hints:</p>
              <ul>
                {Object.entries(currentItem).map(([key, val]) => {
                  if (key !== "id" && typeof val === "string") {
                    return <li key={key}>{`${key}: ${val}`}</li>;
                  }
                  return null;
                })}
              </ul>
            </div>
          )}

          {showFindAnswerButton && (
            <button onClick={findAnswer}>Find Answer</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Verb;
