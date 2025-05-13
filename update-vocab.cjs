const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src", "data", "vocab.json");
const filepath2 = path.join(__dirname, "src", "data", "doushi.json");

try {
  // Read and parse the vocab data
  const rawData = fs.readFileSync(filePath, "utf-8");
  const vocab = JSON.parse(rawData);

  const rawData2 = fs.readFileSync(filepath2, "utf-8");
  const verb = JSON.parse(rawData2);

  // Optional: Sort the entries by current ID (just in case it's unordered)
  const sorted = [...vocab].sort((a, b) => a.id - b.id);

  // Update IDs and recalculate card numbers
  const updated = sorted.map((entry, index) => ({
    ...entry,
    id: index + 1, // Sequentially reassign IDs
    card: Math.floor(index / 9) + 1, // Update card number
  }));

  const updatedVerb = verb.map((entry, index) => ({
    ...entry,
    id: entry.id || index + 1, // If no ID exists, assign a new one
  }));

  // Save the updated data back to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  fs.writeFileSync(filepath2, JSON.stringify(updatedVerb, null, 2), "utf-8");

  console.log("✅ vocab.json updated with new IDs and card numbers.");
} catch (error) {
  console.error("❌ Failed to update vocab.json:", error);
}
