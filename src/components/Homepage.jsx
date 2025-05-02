import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Welcome to the Japanese Learning App!</h1>
        <p>
          Start learning Japanese by practicing Vocab, Adjectives, Kanji, and
          Verbs.
        </p>
      </header>

      <main className="homepage-content">
        <div className="homepage-section">
          <h2>Practice Your Skills</h2>
          <p>Select a category to start learning:</p>
          <div className="homepage-links">
            <Link to="/vocab" className="homepage-link">
              Vocab
            </Link>
            <Link to="/adjectives" className="homepage-link">
              Adjectives
            </Link>
            <Link to="/kanji" className="homepage-link">
              Kanji
            </Link>
            <Link to="/verbs" className="homepage-link">
              Verbs
            </Link>
          </div>
        </div>

        <div className="homepage-info">
          <h2>How it Works</h2>
          <p>
            This app helps you improve your Japanese by practicing essential
            vocabulary, adjectives, verbs, and kanji. Each category includes
            interactive tests to help you memorize and use Japanese effectively.
          </p>
        </div>
      </main>

      <footer className="homepage-footer">
        <p>&copy; 2025 Japanese Learning App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Homepage;
