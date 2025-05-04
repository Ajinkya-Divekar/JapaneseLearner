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
    <div className="max-w-4xl mx-auto my-10 p-8 bg-gradient-to-br from-teal-50 via-white to-cyan-50 shadow-2xl rounded-3xl space-y-8 border border-teal-100">
      <h1 className="text-3xl font-extrabold text-teal-700 tracking-tight text-center">
        📝 Japanese Verb Test
      </h1>

      {/* Checkbox Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "masu", label: "Masu-form" },
          { name: "te", label: "Te-form" },
          { name: "jp", label: "Dictionary (JP)" },
          { name: "eng", label: "English" },
        ].map(({ name, label }) => (
          <label
            key={name}
            className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-white border border-teal-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all"
          >
            <input
              type="checkbox"
              name={name}
              checked={selectedForms[name]}
              onChange={handleFormSelect}
              className="hidden peer"
            />
            <span className="w-5 h-5 border-2 border-teal-500 rounded-md flex items-center justify-center text-transparent peer-checked:bg-teal-500 peer-checked:text-white peer-checked:border-teal-600 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-teal-900">{label}</span>
          </label>
        ))}
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={startTest}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:brightness-110 shadow-lg transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Generate Test
        </button>
      </div>

      {/* Test Interface */}
      {testStarted && currentItem && (
        <div className="space-y-6 bg-white border border-cyan-100 p-6 rounded-2xl shadow-inner">
          <h2 className="text-2xl font-bold text-cyan-700 text-center">
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
            placeholder="Type your answer..."
            className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
          />

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={checkAnswer}
              className="px-5 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition shadow-md"
            >
              ✅ Check Answer
            </button>

            {showFindAnswerButton && (
              <button
                onClick={findAnswer}
                className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition shadow-md"
              >
                🕵️ Find Answer
              </button>
            )}
          </div>

          {/* Hint Box */}
          {hintVisible && (
            <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-xl">
              <p className="text-cyan-800 font-semibold mb-2">💡 Hints:</p>
              <ul className="list-disc list-inside text-cyan-700 space-y-1">
                {Object.entries(currentItem).map(([key, val]) => {
                  if (key !== "id" && typeof val === "string") {
                    return <li key={key}>{`${key}: ${val}`}</li>;
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Verb;
