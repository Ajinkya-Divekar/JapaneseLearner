import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Homepage() {
  const [level, setLevel] = useState("N5");
  const levels = ["N5", "N4", "N3", "N2", "N1"];

  // Load level from localStorage on mount
  useEffect(() => {
    const storedLevel = localStorage.getItem("jlptLevel") || "N5";
    setLevel(storedLevel);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 flex flex-col items-center relative">
      {/* Glassy Navbar with Level Tabs */}
      {/* <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/30 border-b border-indigo-300 rounded-b-3xl shadow-xl">
        <div className="grid grid-cols-5">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setLevel(lvl);
                localStorage.setItem("jlptLevel", lvl);
              }}
              className={`w-full h-16 text-base font-semibold uppercase tracking-wide border-x first:border-l-0 last:border-r-0 transition-all duration-300
              ${
                level === lvl
                  ? "bg-indigo-200/40 text-indigo-900 border-indigo-500 shadow-inner"
                  : "bg-white/20 text-indigo-700 hover:bg-white/30 border-indigo-300"
              }`}
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow:
                  level === lvl
                    ? "inset 0 3px 6px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(255,255,255,0.15)"
                    : "inset 0 1px 2px rgba(255,255,255,0.1)",
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </nav> */}

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-6 auto-rows-min gap-6 mt-20 px-4 sm:px-6">
        {/* Header */}
        <header className="md:col-span-6 p-6 bg-white/60 backdrop-blur-md text-center rounded-3xl border border-gray-200 shadow-2xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800">
            🎌 Welcome!
          </h1>
          <p className="text-gray-700">
            Practice Vocabulary, Adjectives, Kanji & Verbs interactively.
          </p>
        </header>

        {/* Practice Section */}
        <section className="md:col-span-2 row-span-2 p-6 bg-indigo-200/40 backdrop-blur-md border border-indigo-300 rounded-3xl shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold text-indigo-900 mb-3">
            🧠 Practice Your Skills
          </h2>
          <p className="text-gray-800 mb-4">Choose a category to begin:</p>
          <div className="flex flex-col space-y-3">
            {[
              { to: "/vocab", label: "📘 Vocabulary" },
              { to: "/adjectives", label: "📗 Adjectives" },
              { to: "/kanji", label: "🈷️ Kanji" },
              { to: "/verbs", label: "📙 Verbs" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="bg-white text-teal-700 text-lg font-medium rounded-xl px-4 py-2 shadow-md hover:shadow-xl transform hover:scale-105 hover:translate-y-1 transition-all"
              >
                {`${label} ${level}`}
              </Link>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="md:col-span-2 row-span-3 p-6 bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            🔍 How it Works
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Improve your Japanese by testing core topics. Smart test logic
            ensures better retention over time.
          </p>
        </section>

        {/* Extra Features */}
        <section className="md:col-span-2 row-span-3 p-6 bg-indigo-200/40 backdrop-blur-md border border-indigo-300 rounded-3xl shadow-xl">
          <h2 className="text-xl font-semibold text-indigo-900 mb-3">
            🚀 Hone Your Skills
          </h2>
          <p className="text-gray-800 mb-4">Practice more categories:</p>
          <div className="flex flex-col space-y-3">
            {[
              { to: "/hiragana", label: "📘 Hiragana" },
              { to: "/katakana", label: "📗 Katakana" },
              { to: "/kanji-practice", label: "📕 Kanji" },
              { to: "/adjective-practice", label: "📙 Adjectives" },
              { to: "/verb-practice", label: "📒 Verbs" },
              { to: "/vocab-practice", label: "📓 Vocabulary" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="bg-white text-teal-700 text-lg font-medium rounded-xl px-4 py-2 shadow-md hover:shadow-xl transform hover:scale-105 hover:translate-y-1 transition-all"
              >
                {`${label} ${level}`}
              </Link>
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section className="md:col-span-2 p-6 bg-pink-100/60 backdrop-blur-md border border-pink-200 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold text-pink-900 mb-2">💡 Tips</h2>
          <p className="text-gray-800">
            Review daily and stay consistent to retain new words effectively!
          </p>
        </section>
      </div>
    </div>
  );
}

export default Homepage;
