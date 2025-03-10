// Endpoints for orders, RFQs, and POs
const express = require("express");
const router = express.Router();
const hasRole = require("../middlewares/roleMiddleware");
const orderController = require("../controllers/orderController");

// Create a new order (Admin/Staff/Customer)
router.post(
  "/",
  hasRole(["Admin", "Staff", "Customer"]),
  orderController.createOrder,
);

// Retrieve your orders (Customers only)
router.get("/myorders", hasRole(["Customer"]), orderController.getMyOrders);

// Update your order by ID (Customers only)
router.put(
  "/myorders/:id",
  hasRole(["Customer"]),
  orderController.updateMyOrderById,
);

// Retrieve all orders (Admin/Staff only)
router.get("/", hasRole(["Admin", "Staff"]), orderController.getAllOrders);

// Retrieve a specific order by ID (Admin/Staff only)
router.get("/:id", hasRole(["Admin", "Staff"]), orderController.getOrderById);

// Update an order by ID (Admin/Staff only)
router.put(
  "/:id",
  hasRole(["Admin", "Staff"]),
  orderController.updateOrderById,
);

// Delete an order by ID (Admin/Staff only)
router.delete(
  "/:id",
  hasRole(["Admin", "Staff"]),
  orderController.deleteOrderById,
);

module.exports = router;
