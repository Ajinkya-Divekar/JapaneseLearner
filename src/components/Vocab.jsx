import React, { useState, useRef, useEffect } from "react";
import vocabList from "../data/vocab.json";

const VocabTest = () => {
  const [selectedCardRanges, setSelectedCardRanges] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [testList, setTestList] = useState([]);
  const [visited, setVisited] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [random100, setRandom100] = useState(false);
  const [marks, setMarks] = useState(0);

  const dropdownRef = useRef(null);

  const rangeSize = 10;
  const maxCard = Math.max(...vocabList.map((entry) => entry.card));
  const ranges = Array.from(
    { length: Math.ceil(maxCard / rangeSize) },
    (_, i) => {
      const start = i * rangeSize + 1;
      const end = Math.min(start + rangeSize - 1, maxCard);
      return { start, end };
    }
  );

  useEffect(() => {
    const firstRange = ranges[0];
    const defaultCards = Array.from(
      { length: firstRange.end - firstRange.start + 1 },
      (_, i) => firstRange.start + i
    );
    setSelectedCardRanges(defaultCards);
  }, []);

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

  const toggleRangeSelection = (start, end) => {
    const rangeCards = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
    const allSelected = rangeCards.every((card) =>
      selectedCardRanges.includes(card)
    );
    setSelectedCardRanges((prev) =>
      allSelected
        ? prev.filter((card) => !rangeCards.includes(card))
        : [...new Set([...prev, ...rangeCards])]
    );
  };

  const generateTestList = () => {
    let filtered = [];

    if (random100) {
      const groupedByCard = {};
      vocabList.forEach((entry) => {
        if (!groupedByCard[entry.card]) {
          groupedByCard[entry.card] = [];
        }
        groupedByCard[entry.card].push(entry);
      });

      const cardKeys = Object.keys(groupedByCard);
      const perCard = Math.floor(100 / cardKeys.length);
      const remainder = 100 % cardKeys.length;

      cardKeys.forEach((card, index) => {
        const limit = perCard + (index < remainder ? 1 : 0);
        const entries = [...groupedByCard[card]];
        const selected = [];

        while (selected.length < Math.min(limit, entries.length)) {
          const randIdx = Math.floor(Math.random() * entries.length);
          selected.push(entries.splice(randIdx, 1)[0]);
        }

        filtered = filtered.concat(selected);
      });
    } else {
      filtered = vocabList.filter((entry) =>
        selectedCardRanges.includes(entry.card)
      );
      if (filtered.length === 0) {
        alert("Please select at least one card range.");
        return;
      }
    }

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
    setMarks(0);
  };

  const handleNext = () => {
    const available = testList
      .map((_, i) => i)
      .filter((i) => !visited.includes(i));
    if (available.length === 0) {
      setTestComplete(true);
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
    const answer = reverse
      ? testList[currentIndex].jp
      : testList[currentIndex].eng;
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
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-br from-indigo-50 to-indigo-100 min-h-screen flex flex-col items-center">
      {/* Control Panel */}
      <div className="bg-white/30 border border-white/50 rounded-2xl shadow-xl p-8 w-full mb-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-indigo-900">
            Select Card Ranges:
          </h2>

          <div className="relative w-full md:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2.5 bg-white/50 border-2 border-indigo-200 rounded-xl text-indigo-900 font-medium text-left"
            >
              {selectedCardRanges.length === 0
                ? "Choose cards"
                : `${selectedCardRanges.length} cards selected`}
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-64 bg-white border border-indigo-200 rounded-xl shadow-xl p-4 max-h-60 overflow-y-auto space-y-3">
                <label className="flex items-center space-x-2 font-semibold text-indigo-900">
                  <input
                    type="checkbox"
                    checked={random100}
                    onChange={() => {
                      setRandom100(!random100);
                      setSelectedCardRanges([]);
                    }}
                    className="accent-indigo-600"
                  />
                  <span>Random 100</span>
                </label>

                <label className="flex items-center space-x-2 font-semibold text-indigo-900">
                  <input
                    type="checkbox"
                    checked={
                      selectedCardRanges.length === maxCard && !random100
                    }
                    onChange={() => {
                      if (random100) return;
                      if (selectedCardRanges.length === maxCard) {
                        setSelectedCardRanges([]);
                      } else {
                        const allCards = Array.from(
                          { length: maxCard },
                          (_, i) => i + 1
                        );
                        setSelectedCardRanges(allCards);
                      }
                    }}
                    className="accent-indigo-600"
                    disabled={random100}
                  />
                  <span>Select All</span>
                </label>

                {ranges.map(({ start, end }) => {
                  const rangeCards = Array.from(
                    { length: end - start + 1 },
                    (_, i) => start + i
                  );
                  const isChecked = rangeCards.every((card) =>
                    selectedCardRanges.includes(card)
                  );
                  return (
                    <label
                      key={`${start}-${end}`}
                      className="flex items-center space-x-2 cursor-pointer text-indigo-800"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked && !random100}
                        onChange={() => {
                          if (!random100) toggleRangeSelection(start, end);
                        }}
                        className="accent-indigo-600"
                        disabled={random100}
                      />
                      <span>{`${start}–${end}`}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={generateTestList}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all"
          >
            Generate List
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg">
          <span className="text-lg text-indigo-900 font-medium">
            Reverse: Show English first
          </span>
          <label className="cursor-pointer">
            <div className="relative inline-block h-8 w-14 rounded-full bg-indigo-200 transition">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={reverse}
                onChange={(e) => setReverse(e.target.checked)}
              />
              <span className="absolute inset-y-0 left-0 m-1 w-6 h-6 rounded-full bg-white shadow-md transition-all peer-checked:left-6 peer-checked:bg-indigo-600"></span>
            </div>
          </label>
        </div>
      </div>

      {/* Quiz Panel */}
      {testStarted &&
        testList.length > 0 &&
        currentIndex !== null &&
        !testComplete && (
          <div className="bg-white/30 border border-white/50 rounded-2xl shadow-xl p-8 w-full space-y-6">
            <div className="text-4xl font-bold text-indigo-900 text-center min-h-[120px] flex items-center justify-center">
              {reverse ? testList[currentIndex].eng : testList[currentIndex].jp}
            </div>
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

              {attempts >= 3 && !showAnswer && (
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

      {showAnswer && (
        <div className="mt-8 p-6 w-full bg-emerald-50/90 border border-emerald-200 rounded-2xl shadow-lg text-center">
          <p className="text-sm font-semibold text-emerald-600 mb-2">
            CORRECT ANSWER
          </p>
          <p className="text-2xl font-medium text-emerald-900">
            {reverse ? testList[currentIndex].jp : testList[currentIndex].eng}
          </p>
        </div>
      )}
    </div>
  );
};

export default VocabTest;
