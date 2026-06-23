const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true, // MongoDB-level uniqueness index
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // References the Category collection
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Text index for name search (enables efficient $text queries)
productSchema.index({ name: "text" });

module.exports = mongoose.model("Product", productSchema);
