import React, { useState, useEffect, useRef } from "react";
import kanjiList from "../data/kanji.json";

const KanjiTest = () => {
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [testList, setTestList] = useState([]);
  const [visited, setVisited] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [selectedField, setSelectedField] = useState("kun");
  const [showHint, setShowHint] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const generateTestList = () => {
    const filtered = kanjiList.filter((entry) =>
      selectedLessons.includes(entry.lesson)
    );
    setTestList(filtered);
    resetTest(filtered);
    setTestStarted(true);
  };

  const resetTest = (list) => {
    const randIdx = Math.floor(Math.random() * list.length);
    setCurrentIndex(randIdx);
    setVisited([randIdx]);
    setUserInput("");
    setAttempts(0);
    setShowAnswer(false);
    setShowHint(false);
    setRevealedAnswer(null);
  };

  const handleNext = () => {
    const available = testList
      .map((_, i) => i)
      .filter((i) => !visited.includes(i));
    if (available.length === 0) {
      setTestStarted(false);
      return;
    }
    const nextIdx = available[Math.floor(Math.random() * available.length)];
    setCurrentIndex(nextIdx);
    setVisited([...visited, nextIdx]);
    setUserInput("");
    setAttempts(0);
    setShowAnswer(false);
    setShowHint(false);
    setRevealedAnswer(null);
  };

  const handleSubmit = () => {
    if (!testList[currentIndex]) return;
    const answer = testList[currentIndex][selectedField];
    const acceptedAnswers = answer
      .split("/")
      .map((a) => a.trim().toLowerCase());
    const input = userInput.trim().toLowerCase();
    if (acceptedAnswers.includes(input)) {
      handleNext();
    } else {
      setAttempts(attempts + 1);
      setShowHint(true);
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
    const answer = testList[currentIndex][selectedField];
    setRevealedAnswer(answer);
  };

  const getHint = () => {
    if (!testList[currentIndex] || !showHint) return "";
    return selectedField !== "kun"
      ? `Hint (kun): ${testList[currentIndex].kun}`
      : `Hint (meaning): ${testList[currentIndex].meaning}`;
  };

  const toggleLessonSelection = (lessonNumber) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonNumber)
        ? prev.filter((lesson) => lesson !== lessonNumber)
        : [...prev, lessonNumber]
    );
  };

  const maxLesson = Math.max(...kanjiList.map((entry) => entry.lesson));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-8 space-y-10">
        <h1 className="text-4xl font-bold text-center mb-4 text-green-800">
          Kanji Practice
        </h1>

        {/* Lesson Selection */}
        <div className="w-full max-w-xl mx-auto space-y-6" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 flex items-center justify-between"
            >
              <span>Select Lessons ({selectedLessons.length})</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-green-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {Array.from({ length: maxLesson }, (_, i) => (
                    <label
                      key={i + 1}
                      className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-green-50 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLessons.includes(i + 1)}
                        onChange={() => toggleLessonSelection(i + 1)}
                        className="hidden peer"
                      />
                      <span className="w-5 h-5 border-2 border-green-500 rounded-md flex items-center justify-center text-transparent peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-600 transition-colors">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      </span>
                      <span className="text-gray-700">Lesson {i + 1}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 max-w-xl mx-auto">
          <button
            onClick={generateTestList}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700"
          >
            Start Test
          </button>

          <div className="flex flex-wrap gap-4 bg-green-100 p-4 rounded-xl shadow-lg justify-center">
            {["kun", "on", "meaning"].map((field) => (
              <label
                key={field}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
              >
                <input
                  type="radio"
                  name="answerType"
                  value={field}
                  checked={selectedField === field}
                  onChange={() => setSelectedField(field)}
                  className="form-radio text-green-600 h-4 w-4"
                />
                <span className="capitalize text-gray-800">{field}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Test Area */}
        {testStarted && testList.length > 0 && currentIndex !== null && (
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-700 mb-3">
                {testList[currentIndex].kanji}
              </div>
              <div className="text-gray-500 italic min-h-6">
                {showHint && getHint()}
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer here"
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg shadow hover:bg-green-700 flex-1"
                >
                  Submit Answer
                </button>

                {showAnswer && (
                  <button
                    onClick={handleRevealAnswer}
                    className="bg-green-100 text-green-700 px-8 py-3 rounded-lg shadow hover:bg-green-200 flex-1"
                  >
                    Reveal Answer
                  </button>
                )}
              </div>

              {revealedAnswer && (
                <div className="mt-4 text-center bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow">
                  Correct Answer: <strong>{revealedAnswer}</strong>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              Progress: {visited.length}/{testList.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanjiTest;
