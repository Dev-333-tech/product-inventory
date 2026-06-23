const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const { productValidationRules, validate } = require("../middlewares/validate");

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "", categories = "" } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (categories) {
      const catIds = categories.split(",");
      filter.categories = { $in: catIds };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate("categories", "name")
        .sort({ createdAt: -1 })
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

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", productValidationRules, validate, async (req, res) => {
  try {
    const { name, description, quantity, categories } = req.body;

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
    if (err.code === 11000) {
      return res.status(409).json({ message: "Product name already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

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

