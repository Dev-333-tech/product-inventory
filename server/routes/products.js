// server/routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const { productValidationRules, validate } = require("../middlewares/validate");

// GET /api/products?page=1&limit=5&search=chair&categories=id1,id2
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "", categories = "" } = req.query;

    const filter = {};

    // Search by name (case-insensitive partial match)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Filter by categories (OR logic: product has ANY of the selected)
    if (categories) {
      const catIds = categories.split(",");
      filter.categories = { $in: catIds };
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Run count and data fetch in parallel for performance
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate("categories", "name") // Replace IDs with {_id, name} objects
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(Number(limit)),
    ]);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/products/categories — for populating the dropdown
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products — create a product
router.post("/", productValidationRules, validate, async (req, res) => {
  try {
    const { name, description, quantity, categories } = req.body;

    // Check for duplicate name (case-insensitive)
    const existing = await Product.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existing) {
      return res.status(409).json({ message: "Product name already exists" });
    }

    const product = await Product.create({
      name,
      description,
      quantity,
      categories,
    });
    const populated = await product.populate("categories", "name");

    res.status(201).json(populated);
  } catch (err) {
    // Mongoose unique index violation
    if (err.code === 11000) {
      return res.status(409).json({ message: "Product name already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
