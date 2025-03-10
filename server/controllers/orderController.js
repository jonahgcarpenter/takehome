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
    const orderData = req.body;
    if (req.user) {
      orderData.customer = {
        id: req.user._id,
        displayName: req.user.displayName,
      };
    }
    // Status will default to Pending, no quantity updates needed
    const newOrder = await orderService.createOrder(orderData);

    const io = req.app.get("socketio");
    io.emit("orders-updated", newOrder);

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
    const updatedOrder = await orderService.updateOrder(
      req.params.id,
      req.body,
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    await updatedOrder.populate("products.product", "name price");

    const io = req.app.get("socketio");
    io.emit("orders-updated", updatedOrder);
    io.emit("products-updated");

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      error: error.message,
    });
  }
};

// DELETE /api/orders/:id
// Delete an order (Admin/Staff only)
exports.deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await orderService.deleteOrder(req.params.id);

    // Emit event via WebSocket
    const io = req.app.get("socketio");
    io.emit("orders-updated", { id: req.params.id, deletedOrder });

    io.emit("products-updated");

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
    const orders = await Order.find({ "customer.id": req.user._id }).populate(
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

// PUT /api/orders/myorders/:id
// Update an order placed by the authenticated customer
exports.updateMyOrderById = async (req, res) => {
  try {
    // Find the order and verify ownership
    const order = await Order.findOne({
      _id: req.params.id,
      "customer.id": req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found or you don't have permission to update it",
      });
    }

    // Only allow updates if order is in 'Pending' status
    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Can only modify orders that are in 'Pending' status",
      });
    }

    // Only allow quantity updates for existing products
    const updatedProducts = order.products.map((orderProduct) => {
      const updatedProduct = req.body.products?.find(
        (p) => p.product.toString() === orderProduct.product.toString(),
      );
      return {
        product: orderProduct.product,
        quantity: updatedProduct?.quantity || orderProduct.quantity,
      };
    });

    const allowedUpdates = {
      products: updatedProducts,
    };

    const updatedOrder = await orderService.updateOrder(
      req.params.id,
      allowedUpdates,
    );
    await updatedOrder.populate("products.product", "name price");

    const io = req.app.get("socketio");
    io.emit("orders-updated", updatedOrder);

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

