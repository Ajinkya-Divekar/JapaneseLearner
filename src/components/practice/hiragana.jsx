import React, { useState } from "react";
import characterInfo from "../../data/hiragana.json";

const HIRAGANA_DATA = [
  ["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ", "ん"],
  ["い", "き", "し", "ち", "に", "ひ", "み", "", "り", "", ""],
  ["う", "く", "す", "つ", "ぬ", "ふ", "む", "ゆ", "る", "", ""],
  ["え", "け", "せ", "て", "ね", "へ", "め", "", "れ", "", ""],
  ["お", "こ", "そ", "と", "の", "ほ", "も", "よ", "ろ", "を", ""],
];

const Hiragana = () => {
  const [selected, setSelected] = useState(null);

  const renderExamples = (char) => {
    const info = characterInfo[char];
    if (!info) return null;

    return (
      <div className="w-full max-w-xl mx-auto bg-white/40 border border-white/60 backdrop-blur-md rounded-2xl px-6 py-6 mt-6 shadow-xl">
        <div className="text-center mb-4">
          <div className="text-5xl font-extrabold text-indigo-900">{char}</div>
          <div className="mt-2 text-3xl font-semibold text-teal-700">
            {info.romaji}
          </div>
        </div>

        <div className="flex justify-around gap-4 text-gray-800 text-lg">
          {info.examples.map((ex, i) => (
            <div key={i} className="text-2xl text-center">
              <div className="font-bold">
                {ex.word.split("").map((c, j) =>
                  c === char ? (
                    <span key={j} className="text-indigo-900 font-extrabold">
                      {c}
                    </span>
                  ) : (
                    <span key={j}>{c}</span>
                  )
                )}
              </div>
              <div className="text-sm italic text-gray-600">– {ex.meaning}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 min-h-screen flex flex-col items-center px-6 pb-12">
      <div className="mx-auto mt-10">
        <div className="grid grid-cols-11 gap-3 bg-indigo-200/40 backdrop-blur-md border border-indigo-300 p-6 rounded-2xl shadow-xl">
          {HIRAGANA_DATA.map((row, rowIndex) =>
            row.map((char, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square w-12 flex items-center justify-center text-xl font-medium rounded-lg cursor-pointer transition-all duration-150 ${
                  char
                    ? "hover:bg-indigo-400 hover:shadow text-gray-800"
                    : "pointer-events-none bg-transparent"
                } ${
                  selected === char
                    ? "bg-indigo-300 ring ring-indigo-500 text-white font-bold"
                    : ""
                }`}
                onClick={() => char && setSelected(char)}
              >
                {char || ""}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center">
          {selected ? (
            renderExamples(selected)
          ) : (
            <p className="text-center text-gray-500 text-sm mt-6">
              Click a character to see details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hiragana;
