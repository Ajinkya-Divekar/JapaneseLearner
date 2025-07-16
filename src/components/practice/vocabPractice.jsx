import React, { useState, useMemo } from "react";
import vocab from "../../data/vocab.json";

const VocabPractice = () => {
  const [currentCard, setCurrentCard] = useState(1);
  const [flipped, setFlipped] = useState(false);

  const vocabByCard = useMemo(() => {
    const grouped = {};
    vocab.forEach((item) => {
      if (!grouped[item.card]) grouped[item.card] = [];
      grouped[item.card].push(item);
    });
    return grouped;
  }, []);

  const totalCards = Object.keys(vocabByCard).length;
  const currentVocabList = vocabByCard[currentCard] || [];

  const goToNextCard = () => {
    if (currentCard < totalCards) {
      setCurrentCard((prev) => prev + 1);
      setFlipped(false);
    }
  };

  const goToPrevCard = () => {
    if (currentCard > 1) {
      setCurrentCard((prev) => prev - 1);
      setFlipped(false);
    }
  };

  const handleCardClick = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;

    if (x < box.width * 0.3) {
      goToPrevCard();
    } else if (x > box.width * 0.7) {
      goToNextCard();
    } else {
      setFlipped((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-indigo-800 text-center mb-8">
          🧠 Vocabulary Flashcards
        </h1>

        {/* Flashcard */}
        <div
          className=" cursor-pointer transition duration-500"
          onClick={handleCardClick}
        >
          <div
            className={`rounded-2xl p-3 bg-white/70 min-h-[490px]  shadow-xl border border-white/60 w-full transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
              position: "",
            }}
          >
            {/* Front Side (JP) */}
            <div
              className={`absolute inset-0 flex flex-col gap-1 p-6 backface-hidden transition-opacity duration-300 ${
                flipped ? "opacity-0" : "opacity-100"
              }`}
            >
              {currentVocabList.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-lg font-semibold text-indigo-900 bg-white/70 px-4 py-2 "
                >
                  <span>#{item.id}</span>
                  <span>{item.jp}</span>
                </div>
              ))}
            </div>

            {/* Back Side (ENG) */}
            <div
              className={`absolute inset-0 flex flex-col gap-1 p-6 backface-hidden rotate-y-180 transition-opacity duration-300 ${
                flipped ? "opacity-100" : "opacity-0"
              }`}
            >
              {currentVocabList.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-lg font-semibold text-indigo-900 bg-white/70 px-4 py-2 "
                >
                  <span>#{item.id}</span>
                  <span>{item.eng}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            onClick={goToPrevCard}
            disabled={currentCard === 1}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold disabled:bg-indigo-200 transition"
          >
            ⬅ Prev
          </button>

          <span className="text-indigo-900 font-medium">
            Card {currentCard} of {totalCards}
          </span>

          <button
            onClick={goToNextCard}
            disabled={currentCard === totalCards}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold disabled:bg-indigo-200 transition"
          >
            Next ➡
          </button>
        </div>

        <p className="text-center mt-4 text-sm text-gray-600">
          💡 Click <b>left</b> or <b>right</b> edge to navigate. Click{" "}
          <b>center</b> to flip the card.
        </p>
      </div>
    </div>
  );
};

export default VocabPractice;
