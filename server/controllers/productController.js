const Product = require("../models/Product");

const addProduct = async (req, res) => {
  try {
    const { name, description, quantity, categories } = req.body;

    if (
      !name ||
      !description ||
      quantity === undefined ||
      !categories?.length
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name must be unique" });
    }

    const product = await Product.create({
      name,
      description,
      quantity,
      categories,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct };
