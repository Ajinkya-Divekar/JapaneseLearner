import React, { useState, useEffect, useRef } from "react";
import kanjiList from "../data/kanji.json";

const KanjiTest = () => {
  const [selectedLessons, setSelectedLessons] = useState([]); // For multiple selected lessons
  const [testList, setTestList] = useState([]);
  const [visited, setVisited] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [selectedField, setSelectedField] = useState("kun");
  const [showHint, setShowHint] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For dropdown toggle
  const dropdownRef = useRef(null); // Reference for the dropdown

  // Detect clicks outside of dropdown to close it
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
  };

  const handleNext = () => {
    const available = testList
      .map((_, i) => i)
      .filter((i) => !visited.includes(i));
    if (available.length === 0) {
      alert("Test complete!");
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
    alert(`Correct Answer: ${answer}`);
    handleNext();
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

  // Find the maximum number of lessons based on the JSON data
  const maxLesson = Math.max(...kanjiList.map((entry) => entry.lesson));

  return (
    <div>
      <div>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          Lesson List
        </button>
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              border: "1px solid black",
              background: "#fff",
              padding: "10px",
              maxHeight: "300px",
              overflowY: "auto",
              width: "200px",
            }}
          >
            <label>Select Lessons:</label>
            <div>
              {Array.from({ length: maxLesson }, (_, i) => (
                <div key={i + 1}>
                  <input
                    type="checkbox"
                    checked={selectedLessons.includes(i + 1)}
                    onChange={() => toggleLessonSelection(i + 1)}
                  />
                  Lesson {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={generateTestList}>Generate Test List</button>

      <div>
        <label>
          <input
            type="radio"
            name="answerType"
            value="kun"
            checked={selectedField === "kun"}
            onChange={() => setSelectedField("kun")}
          />
          Kun
        </label>
        <label>
          <input
            type="radio"
            name="answerType"
            value="on"
            checked={selectedField === "on"}
            onChange={() => setSelectedField("on")}
          />
          On
        </label>
        <label>
          <input
            type="radio"
            name="answerType"
            value="meaning"
            checked={selectedField === "meaning"}
            onChange={() => setSelectedField("meaning")}
          />
          Meaning
        </label>
      </div>

      {testStarted && testList.length > 0 && currentIndex !== null && (
        <div>
          <h2>{testList[currentIndex].kanji}</h2>
          <div>{getHint()}</div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here"
          />
          <button onClick={handleSubmit}>Submit</button>
          {showAnswer && (
            <button onClick={handleRevealAnswer}>Find Answer</button>
          )}
        </div>
      )}
    </div>
  );
};

export default KanjiTest;
