// Manages orders, RFQs, and POs
const Order = require("../models/orderModel");
const orderService = require("../services/orderService");

// GET /api/orders
// Retrieve all orders (Admin/Staff only)
exports.getAllOrders = async (req, res) => {
  try {
    // Populate the product field in each order item for better readability.
    const orders = await Order.find({}).populate(
      "products.product",
      "name price",
    );
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// GET /api/orders/:id
// Retrieve a specific order by its ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product",
      "name price",
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// POST /api/orders
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const customer = req.user?._id;
    const orderData = req.body;
    if (customer) {
      orderData.customer = customer;
    }
    const newOrder = await orderService.createOrder(orderData);

    // Emit event via WebSocket
    const io = req.app.get("socketio");
    io.emit("order-created", newOrder);

    return res.status(201).json(newOrder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// PUT /api/orders/:id
// Update an existing order (Admin/Staff only)
exports.updateOrderById = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("products.product", "name price");  // Add populate here
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Emit event via WebSocket
    const io = req.app.get("socketio");
    io.emit("order-updated", updatedOrder);

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/orders/:id
// Delete an order (Admin/Staff only)
exports.deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await orderService.deleteOrder(req.params.id);

    // Emit event via WebSocket
    const io = req.app.get("socketio");
    io.emit("order-deleted", { id: req.params.id, deletedOrder });

    return res
      .status(200)
      .json({ message: "Order deleted successfully", deletedOrder });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// GET /api/orders/myorders
// Retrieve orders placed by the authenticated customer
exports.getMyOrders = async (req, res) => {
  try {
    // req.user is assumed to be set by your authentication middleware
    const orders = await Order.find({ customer: req.user._id }).populate(
      "products.product",
      "name price",
    );
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
