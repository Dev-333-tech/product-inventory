const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from React
app.use(express.json()); // Parse incoming JSON request bodies

// Routes
app.use("/api/products", productRoutes);

// Connect to MongoDB, then start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`),
    );
  })
  .catch((err) => console.error("DB connection error:", err));
