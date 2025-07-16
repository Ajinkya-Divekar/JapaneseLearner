import React, { useState } from "react";
import verbs from "../../data/doushi.json";

const groupLabels = {
  1: "Group 1",
  2: "Group 2",
  3: "Irregular",
};

const VerbCard = ({ verb }) => (
  <div className="p-4 bg-white/60 border border-white/80 backdrop-blur-md rounded-2xl shadow hover:shadow-md transition-all space-y-2">
    <div className="text-2xl font-bold text-indigo-900">{verb.jp}</div>
    <div className="text-teal-700 italic mb-1">{verb.eng}</div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-800">
      <div>
        <b>Masu:</b> {verb.masu_form}
      </div>
      <div>
        <b>Te:</b> {verb.te_form}
      </div>
      <div>
        <b>Nai:</b> {verb.nai_form}
      </div>
      <div>
        <b>Tai:</b> {verb.tai_form}
      </div>
    </div>
  </div>
);

const VerbGroupTab = ({ group, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-t-lg font-semibold text-sm ${
      isActive
        ? "bg-indigo-600 text-white shadow"
        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
    }`}
  >
    {groupLabels[group]}
  </button>
);

const VerbPractice = () => {
  const [activeGroup, setActiveGroup] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const verbsByGroup = verbs.filter((v) => v.group === activeGroup);
  const pageSize = 9;
  const totalPages = Math.ceil(verbsByGroup.length / pageSize);
  const paginatedVerbs = verbsByGroup.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (dir) => {
    setCurrentPage((prev) =>
      dir === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  const handleGroupChange = (group) => {
    setActiveGroup(group);
    setCurrentPage(1); // Reset pagination on group switch
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 px-6 py-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-indigo-800 text-center mb-4">
          📝 Verb Practice
        </h1>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6 border-b border-indigo-300 pb-2">
          {[1, 2, 3].map((group) => (
            <VerbGroupTab
              key={group}
              group={group}
              isActive={activeGroup === group}
              onClick={() => handleGroupChange(group)}
            />
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVerbs.map((verb) => (
            <VerbCard key={verb.id} verb={verb} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold disabled:bg-indigo-200 transition-all"
          >
            ⬅ Prev
          </button>

          <span className="text-indigo-900 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold disabled:bg-indigo-200 transition-all"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerbPractice;
