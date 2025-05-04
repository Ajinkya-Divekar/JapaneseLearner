import { Route, Routes } from "react-router";
import Adjectives from "./components/Adjectives";
import Vocab from "./components/Vocab";
import Kanji from "./components/Kanji";
import { useEffect } from "react";
import vocab from "./data/vocab.json";
import Verb from "./components/Verbs";
import Homepage from "./components/Homepage";
import AuthPage from "./components/Authform";

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
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/vocab" element={<Vocab />} />
        <Route path="/adjectives" element={<Adjectives />} />
        <Route path="/kanji" element={<Kanji />} />
        <Route path="/verbs" element={<Verb />} />
      </Routes>
    </>
  );
}

export default App;
