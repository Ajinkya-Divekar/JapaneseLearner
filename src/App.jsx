import { Route, Routes } from "react-router";
import Adjectives from "./components/Adjectives";
import Vocab from "./components/Vocab";
import Kanji from "./components/Kanji";
import { useEffect } from "react";
import vocab from "./data/vocab.json";
import Verb from "./components/Verbs";
import Homepage from "./components/Homepage";
import AuthPage from "./components/Authform";
import Hiragana from "./components/practice/hiragana";
import Katakana from "./components/practice/katakana";
import KanjiTest from "./components/Kanji";
import KanjiPractice from "./components/practice/kanji";
import AdjectivePractice from "./components/practice/adjectivePractice";
import VerbPractice from "./components/practice/verbPractice";
import VocabPractice from "./components/practice/vocabPractice";

function App() {
  useEffect(() => {
    const updatedList = vocab.map((entry) => ({
      ...entry,
      card: Math.floor((entry.id - 1) / 9) + 1,
    }));

    localStorage.setItem("vocab", JSON.stringify(updatedList)); // Optional: Save to localStorage or file if needed
  }, []);

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<AuthPage />} /> */}
        <Route path="/" element={<Homepage />} />
        <Route path="/vocab" element={<Vocab />} />
        <Route path="/adjectives" element={<Adjectives />} />
        <Route path="/kanji" element={<KanjiTest />} />
        <Route path="/verbs" element={<Verb />} />
        <Route path="/hiragana" element={<Hiragana />} />
        <Route path="/katakana" element={<Katakana />} />
        <Route path="/kanji-practice" element={<KanjiPractice />} />
        <Route path="/adjective-practice" element={<AdjectivePractice />} />
        <Route path="verb-practice" element={<VerbPractice />} />
        <Route path="vocab-practice" element={<VocabPractice />} />
      </Routes>
    </>
  );
}

export default App;
