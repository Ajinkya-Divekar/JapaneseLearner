import React, { useState, useEffect } from "react";
import ikeyoshi from "../../data/ikeyoshi.json";
import nakeyoshi from "../../data/nakeyoshi.json";

const PAGE_SIZE = 16;

const AdjectivePractice = () => {
  const [allAdjectives, setAllAdjectives] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const combined = [...ikeyoshi, ...nakeyoshi];
    setAllAdjectives(combined);
  }, []);

  const totalPages = Math.ceil(allAdjectives.length / PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedAdjectives = allAdjectives.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-indigo-800 text-center mb-8">
          🌸 Adjective Practice
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {paginatedAdjectives.map(({ jp, rom, eng }, index) => (
            <div
              key={`${currentPage}-${index}`}
              className="bg-white/60 border border-white/80 backdrop-blur-md p-4 rounded-2xl shadow hover:shadow-md transition-all"
            >
              <div className="text-2xl font-bold text-indigo-900">{jp}</div>
              <div className="text-teal-700 italic mb-1">{rom}</div>
              <div className="text-gray-800">{eng}</div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold disabled:bg-indigo-200 transition-all"
          >
            ⬅ Prev
          </button>

          <span className="text-indigo-900 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold disabled:bg-indigo-200 transition-all"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjectivePractice;
