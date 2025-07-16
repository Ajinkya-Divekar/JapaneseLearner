import React, { useState } from "react";
import kanjiData from "../../data/kanji.json";

const Kanji = () => {
  const [selected, setSelected] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(1);

  const lessons = Array.from(new Set(kanjiData.map((k) => k.lesson))).sort(
    (a, b) => a - b
  );
  const filteredKanji = kanjiData.filter((k) => k.lesson === selectedLesson);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-800 mb-4 text-center">
        Kanji Practice
      </h1>

      {/* Lesson Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {lessons.map((lesson) => (
          <button
            key={lesson}
            onClick={() => {
              setSelectedLesson(lesson);
              setSelected(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
              lesson === selectedLesson
                ? "bg-indigo-500 text-white shadow"
                : "bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-300"
            }`}
          >
            Lesson {lesson}
          </button>
        ))}
      </div>

      {/* Kanji Grid (Scrollable) */}
      <div className="max-w-5xl w-full mb-8 overflow-y-auto max-h-[360px] border border-indigo-300 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-inner">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 justify-center">
          {filteredKanji.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className={`cursor-pointer aspect-square flex items-center justify-center rounded-lg text-2xl font-bold transition-all duration-150 ${
                selected?.id === item.id
                  ? "bg-indigo-400 text-white ring ring-indigo-600"
                  : "bg-white hover:bg-indigo-100 text-gray-800"
              }`}
            >
              {item.kanji}
            </div>
          ))}
        </div>
      </div>

      {/* Kanji Details */}
      {selected && (
        <div className="max-w-xl w-full bg-white/60 backdrop-blur-md p-6 rounded-xl border border-indigo-200 shadow-lg text-center">
          <h2 className="text-5xl font-extrabold text-indigo-900 mb-4">
            {selected.kanji}
          </h2>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Meaning:</span> {selected.meaning}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Kun'yomi:</span> {selected.kun}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">On'yomi:</span> {selected.on}
          </p>
          <p className="text-sm text-gray-500 mt-2">Lesson {selected.lesson}</p>
        </div>
      )}
    </div>
  );
};

export default Kanji;
