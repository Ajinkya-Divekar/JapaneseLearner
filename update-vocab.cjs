const fs = require("fs");
const path = require("path");

// List of target files to update
const targetFiles = [
  { path: "src/data/vocab.json", addCard: true },
  { path: "src/data/doushi.json", addCard: false },
  { path: "src/data/ikeyoshi.json", addCard: false },
  { path: "src/data/nakeyoshi.json", addCard: false },
  { path: "src/data/kanji.json", addCard: false },
];

const level = "N5"; // Or use lowercase 'n5' if needed

targetFiles.forEach(({ path: relativePath, addCard }) => {
  const filePath = path.join(__dirname, relativePath);

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    let updated = [...data];

    // Sort vocab by ID before reassigning (only for vocab)
    if (relativePath.includes("vocab")) {
      updated = updated.sort((a, b) => a.id - b.id);
    }

    // Update each entry
    updated = updated.map((entry, index) => {
      const newEntry = {
        ...entry,
        id: entry.id || index + 1,
        level: entry.level || level, // Add level if not present
      };

      // Only vocab gets 'card' key
      if (addCard) {
        newEntry.card = Math.floor(index / 9) + 1;
      }

      return newEntry;
    });

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
    console.log(
      `✅ ${relativePath} updated with 'level' and ID${
        addCard ? ", card" : ""
      }.`
    );
  } catch (error) {
    console.error(`❌ Failed to process ${relativePath}:`, error.message);
  }
});
