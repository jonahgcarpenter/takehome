// Endpoints for product CRUD operations
const express = require("express");
const router = express.Router();
const hasRole = require("../middlewares/roleMiddleware");
const productController = require("../controllers/productController");

// Retrieve all products (Admin/Staff/Customer)
router.get(
  "/",
  hasRole(["Admin", "Staff", "Customer"]),
  productController.getAllProducts,
);

// Retrieve a single product by its ID (Admin/Staff/Customer)
router.get(
  "/:id",
  hasRole(["Admin", "Staff", "Customer"]),
  productController.getProductById,
);

// Create a new product (Admin/Staff only)
router.post("/", hasRole(["Admin", "Staff"]), productController.createProduct);

// Update an existing product (Admin/Staff only)
router.put(
  "/:id",
  hasRole(["Admin", "Staff"]),
  productController.updateProductById,
);

// Delete an existing product (Admin/Staff only)
router.delete(
  "/:id",
  hasRole(["Admin", "Staff"]),
  productController.deleteProductById,
);

module.exports = router;
