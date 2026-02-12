#!/usr/bin/env node
// Sort specific arrays in ResourceEx.json and write back.
// Usage: node scripts/sortResourceEx.js [path/to/ResourceEx.json]

const fs = require("fs");
const path = require("path");

const filePath =
  process.argv[2] || path.join(__dirname, "..", "ResourceEx.json");
if (!fs.existsSync(filePath)) {
  console.error("File not found:", filePath);
  process.exit(2);
}

const raw = fs.readFileSync(filePath, "utf8");
let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error("Failed to parse JSON:", err.message);
  process.exit(3);
}

// 1) characters (by id)
if (Array.isArray(data.characters)) {
  data.characters.sort((a, b) => Number(a.id) - Number(b.id));

  data.characters.forEach((character) => {
    const guest = character && character.guest;
    if (!guest) return;

    // foodRequests (by tagId)
    if (Array.isArray(guest.foodRequests)) {
      guest.foodRequests.sort((x, y) => Number(x.tagId) - Number(y.tagId));
    }

    // bevRequests (by tagId)
    if (Array.isArray(guest.bevRequests)) {
      guest.bevRequests.sort((x, y) => Number(x.tagId) - Number(y.tagId));
    }

    // hateFoodTag (array of numbers)
    if (Array.isArray(guest.hateFoodTag)) {
      guest.hateFoodTag.sort((a, b) => Number(a) - Number(b));
    }

    // likeFoodTag (by tagId)
    if (Array.isArray(guest.likeFoodTag)) {
      guest.likeFoodTag.sort((x, y) => Number(x.tagId) - Number(y.tagId));
    }

    // likeBevTag (by tagId)
    if (Array.isArray(guest.likeBevTag)) {
      guest.likeBevTag.sort((x, y) => Number(x.tagId) - Number(y.tagId));
    }

    // spawn (by izakayaId) — if present at guest.spawn
    if (Array.isArray(guest.spawn)) {
      guest.spawn.sort((x, y) => Number(x.izakayaId) - Number(y.izakayaId));
    }
  });
}

// 2) ingredients (by id) and ingredients.tags
if (Array.isArray(data.ingredients)) {
  data.ingredients.sort((a, b) => Number(a.id) - Number(b.id));
  data.ingredients.forEach((ing) => {
    if (Array.isArray(ing.tags)) ing.tags.sort((a, b) => Number(a) - Number(b));
  });
}

// 3) foods (by id) and foods.tags, foods.banTags
if (Array.isArray(data.foods)) {
  data.foods.sort((a, b) => Number(a.id) - Number(b.id));
  data.foods.forEach((food) => {
    if (Array.isArray(food.tags))
      food.tags.sort((a, b) => Number(a) - Number(b));
    if (Array.isArray(food.banTags))
      food.banTags.sort((a, b) => Number(a) - Number(b));
  });
}

// 4) beverages (by id) and beverages.tags
if (Array.isArray(data.beverages)) {
  data.beverages.sort((a, b) => Number(a.id) - Number(b.id));
  data.beverages.forEach((bev) => {
    if (Array.isArray(bev.tags)) bev.tags.sort((a, b) => Number(a) - Number(b));
  });
}

// 5) recipes (by id)
if (Array.isArray(data.recipes)) {
  data.recipes.sort((a, b) => Number(a.id) - Number(b.id));
}

// Write file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Sorted fields and wrote back to", filePath);
