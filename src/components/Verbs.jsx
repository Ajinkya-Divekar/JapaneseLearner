import React, { useState, useEffect } from "react";
import doushiData from "../data/doushi.json";

const Verb = () => {
  const [selectedForm, setSelectedForm] = useState("jp");
  const [currentItem, setCurrentItem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [visited, setVisited] = useState(new Set());
  const [finished, setFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showFindAnswerButton, setShowFindAnswerButton] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState(null);

  const getRandomItem = () => {
    const unvisited = doushiData.filter((item) => !visited.has(item.id));
    if (unvisited.length === 0) {
      setFinished(true);
      return null;
    }
    const randIndex = Math.floor(Math.random() * unvisited.length);
    return unvisited[randIndex];
  };

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
    setRevealedAnswer(null);
  };

  const loadNextQuestion = () => {
    const nextItem = getRandomItem();
    if (nextItem) {
      setCurrentItem(nextItem);
      setUserAnswer("");
      setHintVisible(false);
      setIncorrectAttempts(0);
      setShowFindAnswerButton(false);
      setRevealedAnswer(null);
    }
  };

  const checkAnswer = () => {
    let correctAnswer = null;

    switch (selectedForm) {
      case "jp":
        correctAnswer = currentItem.jp;
        break;
      case "masu":
        correctAnswer = currentItem.masu_form;
        break;
      case "te":
        correctAnswer = currentItem.te_form;
        break;
      case "eng":
        correctAnswer = currentItem.eng;
        break;
      default:
        console.warn("No valid form selected");
        return;
    }

    const normalized = userAnswer.toLowerCase().trim();
    if (normalized === correctAnswer.toLowerCase().trim()) {
      setVisited((prev) => new Set(prev).add(currentItem.id));
      setTimeout(() => {
        loadNextQuestion();
      }, 200);
    } else {
      setIncorrectAttempts((prev) => prev + 1);
      setHintVisible(true);
      if (incorrectAttempts >= 2) {
        setShowFindAnswerButton(true);
      }
    }
  };

  const findAnswer = () => {
    let correctAnswer = null;

    switch (selectedForm) {
      case "jp":
        correctAnswer = currentItem.jp;
        break;
      case "masu":
        correctAnswer = currentItem.masu_form;
        break;
      case "te":
        correctAnswer = currentItem.te_form;
        break;
      case "eng":
        correctAnswer = currentItem.eng;
        break;
      default:
        correctAnswer = "";
    }

    setRevealedAnswer(correctAnswer);
    setIncorrectAttempts(0);
    setShowFindAnswerButton(false);
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleFormSelect = (e) => {
    setSelectedForm(e.target.value);
  };

  useEffect(() => {
    if (testStarted && currentItem === null) {
      loadNextQuestion();
    }
  }, [testStarted, currentItem]);

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

  useEffect(() => {
    if (finished) {
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
          { value: "masu", label: "Masu-form" },
          { value: "te", label: "Te-form" },
          { value: "jp", label: "Dictionary (JP)" },
          { value: "eng", label: "English" },
        ].map(({ value, label }) => (
          <label
            key={value}
            className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-white border border-teal-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all"
          >
            <input
              type="radio"
              name="form"
              value={value}
              checked={selectedForm === value}
              onChange={handleFormSelect}
              className="hidden peer"
            />
            <span className="w-5 h-5 border-2 border-teal-500 rounded-full flex items-center justify-center text-transparent peer-checked:bg-teal-500 peer-checked:text-white peer-checked:border-teal-600 transition-colors">
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
            {selectedForm === "eng"
              ? currentItem.jp
              : selectedForm === "jp"
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
              className="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition shadow-md"
            >
              ✅ Check Answer
            </button>

            {showFindAnswerButton && (
              <button
                onClick={findAnswer}
                className="px-5 py-2 bg-gradient-to-l from-teal-600 to-cyan-600 text-white rounded-lg hover:bg-teal-600 transition shadow-md"
              >
                🕵️ Find Answer
              </button>
            )}
          </div>

          {/* Answer Reveal Block */}
          {revealedAnswer && (
            <div className="mt-8 p-6 w-full bg-teal-50/90 border border-cyan-300 rounded-2xl shadow-lg text-center">
              <p className="text-sm font-semibold text-cyan-600 mb-2">
                CORRECT ANSWER
              </p>
              <p className="text-2xl font-medium text-cyan-900">
                {revealedAnswer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Verb;
