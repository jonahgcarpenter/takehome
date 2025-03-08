// Endpoints for product CRUD operations
const express = require("express");
const router = express.Router();
const hasRole = require("../middlewares/roleMiddleware");
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

// ADMIN/STAFF ONLY
router.post("/", hasRole(["Admin", "Staff"]), productController.createProduct);
router.put(
  "/:id",
  hasRole(["Admin", "Staff"]),
  productController.updateProductById,
);
router.delete(
  "/:id",
  hasRole(["Admin", "Staff"]),
  productController.deleteProductById,
);

module.exports = router;
