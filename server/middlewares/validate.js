const { body, validationResult } = require("express-validator");

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

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { productValidationRules, validate };
