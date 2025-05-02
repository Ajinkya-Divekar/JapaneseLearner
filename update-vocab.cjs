const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src", "data", "vocab.json");

try {
  // Read and parse the vocab data
  const rawData = fs.readFileSync(filePath, "utf-8");
  const vocab = JSON.parse(rawData);

  // Optional: Sort the entries by current ID (just in case it's unordered)
  const sorted = [...vocab].sort((a, b) => a.id - b.id);

  // Update IDs and recalculate card numbers
  const updated = sorted.map((entry, index) => ({
    ...entry,
    id: index + 1, // Sequentially reassign IDs
    card: Math.floor(index / 9) + 1, // Update card number
  }));

  // Save the updated data back to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");

  console.log("✅ vocab.json updated with new IDs and card numbers.");
} catch (error) {
  console.error("❌ Failed to update vocab.json:", error);
}
