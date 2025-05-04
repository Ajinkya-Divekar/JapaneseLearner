import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-gray-100 to-pink-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-6 auto-rows-min gap-6">
        {/* Header */}
        <header className="md:col-span-6 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-gray-200 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center sm:text-left text-indigo-800 mb-2">
            🎌 Welcome to the Japanese Learning App!
          </h1>
          <p className="text-gray-700 text-center sm:text-left">
            Start learning Japanese by practicing Vocabulary, Adjectives, Kanji,
            and Verbs interactively.
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
              { to: "/vocab", label: "📘 Vocab" },
              { to: "/adjectives", label: "📗 Adjectives" },
              { to: "/kanji", label: "🈷️ Kanji" },
              { to: "/verbs", label: "📙 Verbs" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="bg-white text-teal-700 text-lg font-medium rounded-xl px-4 py-2 shadow-md hover:shadow-xl transform hover:scale-105 hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="md:col-span-3 row-span-3 p-6 bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            🔍 How it Works
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This app improves your Japanese by testing you on core topics like
            verbs, vocabulary, adjectives, and kanji. Each topic includes smart
            tests to challenge your knowledge and help you retain what you’ve
            learned.
          </p>
        </section>

        {/* Extra Features */}
        <section className="md:col-span-1 row-span-3 p-6 bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            🚀 Extra Features
          </h2>
          <p className="text-gray-700">
            More advanced features like spaced repetition, AI quiz generation,
            and progress tracking coming soon!
          </p>
        </section>

        {/* Tips Section */}
        <section className="md:col-span-2 p-6 bg-pink-100/60 backdrop-blur-md border border-pink-200 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold text-pink-900 mb-2">💡 Tips</h2>
          <p className="text-gray-800">
            Review daily and stay consistent to retain new words effectively!
          </p>
        </section>

        {/* Footer */}
        <footer className="md:col-span-6 p-4 text-center bg-white/60 border border-gray-200 rounded-2xl shadow-md text-sm text-gray-600">
          &copy; 2025 Japanese Learning App. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Homepage;
