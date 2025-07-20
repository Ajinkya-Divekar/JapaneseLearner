import React, { useState, useEffect, useRef } from "react";
import kanjiList from "../data/kanji.json";

const KanjiTest = () => {
  const [selectedLessons, setSelectedLessons] = useState([1]);
  const [testList, setTestList] = useState([]);
  const [visited, setVisited] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [selectedField, setSelectedField] = useState("kun");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [marks, setMarks] = useState(0);

  const dropdownRef = useRef(null);
  const maxLesson = Math.max(...kanjiList.map((entry) => entry.lesson));
  const allLessons = Array.from({ length: maxLesson }, (_, i) => i + 1);
  const isAllSelected = selectedLessons.length === allLessons.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLessonSelection = (lesson) => {
    setSelectedLessons((prev) =>
      prev.includes(lesson)
        ? prev.filter((l) => l !== lesson)
        : [...prev, lesson]
    );
  };

  const toggleSelectAll = () => {
    setSelectedLessons(isAllSelected ? [] : allLessons);
  };

  const generateTestList = () => {
    const filtered = kanjiList.filter((entry) =>
      selectedLessons.includes(entry.lesson)
    );
    if (filtered.length === 0) {
      alert("Please select at least one lesson.");
      return;
    }
    setTestList(filtered);
    resetTest(filtered);
    setTestStarted(true);
    setShowAnswer(false);
    setMarks(0);
  };

  const resetTest = (list) => {
    const randIdx = Math.floor(Math.random() * list.length);
    setCurrentIndex(randIdx);
    setVisited([randIdx]);
    setUserInput("");
    setAttempts(0);
    setShowAnswer(false);
    setMarks(0);
  };

  const handleNext = () => {
    const available = testList
      .map((_, i) => i)
      .filter((i) => !visited.includes(i));
    if (available.length === 0) {
      setTestStarted(false);
      alert(`Test completed!\nScore: ${marks}/${testList.length}`);
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
    const answer = testList[currentIndex][selectedField];
    const acceptedAnswers = answer
      .split("/")
      .map((a) => a.trim().toLowerCase());
    const input = userInput.trim().toLowerCase();

    if (acceptedAnswers.includes(input)) {
      setMarks((prev) => prev + 1);
      setUserInput("");
      setAttempts(0);
      setShowAnswer(false);
      handleNext();
    } else {
      setAttempts((prev) => prev + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="p-6 w-full mx-auto bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 min-h-screen flex flex-col items-center">
      {/* Control Panel */}
      <div className="bg-indigo-200/40 backdrop-blur-md border border-indigo-300 max-w-3xl rounded-2xl shadow-xl p-8 w-full mb-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-indigo-900">Select Lessons:</h2>

          <div className="relative w-full md:w-auto" ref={dropdownRef}>
            <button
              onClick={() =>
                !testStarted
                  ? setIsDropdownOpen(!isDropdownOpen)
                  : setIsDropdownOpen(false)
              }
              className="w-full px-4 py-2.5 bg-white/50 border-2 border-indigo-200 rounded-xl text-indigo-900 font-medium text-left"
            >
              {selectedLessons.length === 0
                ? "Choose lessons"
                : `${selectedLessons.length} lessons selected`}
            </button>

            {isDropdownOpen && (
              <div className="absolute z-40 mt-2 w-64 bg-white border border-indigo-200 rounded-xl shadow-xl p-4 max-h-60 overflow-y-auto space-y-3">
                <label className="flex items-center space-x-2 font-semibold text-indigo-900">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="accent-indigo-600"
                  />
                  <span>Select All</span>
                </label>

                {allLessons.map((lesson) => (
                  <label
                    key={lesson}
                    className="flex items-center space-x-2 cursor-pointer text-indigo-800"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLessons.includes(lesson)}
                      onChange={() => toggleLessonSelection(lesson)}
                      className="accent-indigo-600"
                    />
                    <span>Lesson {lesson}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={generateTestList}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all"
          >
            Start Test
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg">
          <span className="text-lg text-indigo-900 font-medium">
            Answer Field:
          </span>
          <div className="flex space-x-3">
            {["kun", "on", "meaning"].map((field) => (
              <label
                key={field}
                className={`px-4 py-2 rounded-xl font-medium cursor-pointer transition ${
                  selectedField === field
                    ? "bg-indigo-600 text-white"
                    : "bg-white/50 border border-indigo-200 text-indigo-900"
                }`}
              >
                <input
                  type="radio"
                  name="field"
                  value={field}
                  checked={selectedField === field}
                  onChange={() => setSelectedField(field)}
                  className="hidden"
                />
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Test Panel */}
      {testStarted && testList.length > 0 && currentIndex !== null && (
        <div className="bg-indigo-200/40 backdrop-blur-md border border-indigo-300 max-w-3xl rounded-2xl shadow-xl p-8 w-full space-y-6">
          <div className="text-5xl font-bold text-indigo-900 text-center min-h-[120px] flex items-center justify-center">
            {testList[currentIndex].kanji}
          </div>

          {attempts > 0 && selectedField !== "kun" && (
            <div className="text-center text-sm italic text-indigo-700">
              Hint (kun): {testList[currentIndex].kun}
            </div>
          )}

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
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

            {attempts >= 3 && (
              <button
                onClick={() => {
                  if (marks > 0) setMarks((prev) => prev - 1);
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

          <div className="text-center text-sm text-gray-500">
            Progress: {visited.length}/{testList.length} | Score: {marks}
          </div>
        </div>
      )}

      {/* Answer Reveal */}
      {showAnswer && (
        <div className="mt-8 p-6 min-w-3xl bg-emerald-50/90 border border-emerald-200 rounded-2xl shadow-lg text-center">
          <p className="text-sm font-semibold text-emerald-600 mb-2">
            CORRECT ANSWER
          </p>
          <p className="text-2xl font-medium text-emerald-900">
            {testList[currentIndex][selectedField]}
          </p>
        </div>
      )}
    </div>
  );
};

export default KanjiTest;
