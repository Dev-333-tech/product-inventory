// server/seeders/categorySeeder.js
const mongoose = require("mongoose");
require("dotenv").config();
const Category = require("../models/Category");

const categories = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Books",
  "Home & Garden",
  "Sports & Outdoors",
  "Toys & Games",
  "Health & Beauty",
];

async function seed() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/product_inventory";
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set in .env, using fallback local MongoDB URI.");
  }

  await mongoose.connect(mongoUri);

  await Category.deleteMany({}); // Clear existing
  await Category.insertMany(categories.map((name) => ({ name })));
  console.log("Categories seeded!");
  await mongoose.disconnect();
}

seed().catch(console.error);
