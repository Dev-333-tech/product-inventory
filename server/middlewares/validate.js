// server/middleware/validate.js
const { body, validationResult } = require("express-validator");

// Rules that run before the route handler
const productValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be under 100 characters"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category is required"),
];

// Middleware that checks if any validation rule failed
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // All good, proceed to route handler
};

module.exports = { productValidationRules, validate };
