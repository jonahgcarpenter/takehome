const Order = require("../models/orderModel");
const Product = require("../models/productModel");

/**
 * Updates product quantities in the inventory based on order status changes
 * @param {Array} products - Array of order items containing product IDs and quantities
 * @param {boolean} increase - If true, increases quantity; if false, decreases quantity
 * @throws {Error} When resulting product quantity would be negative
 * @returns {Promise<void>}
 */
const updateProductQuantities = async (products, increase = false) => {
  for (const item of products) {
    // Skip if product field is null
    if (item.product === null) {
      continue;
    }

    const product = await Product.findById(item.product);
    if (!product) {
      console.warn(`Warning: Product ${item.product} not found, skipping quantity update`);
      continue;
    }

    const quantityChange = increase ? item.quantity : -item.quantity;
    product.quantity += quantityChange;

    if (product.quantity < 0) {
      throw new Error(
        `Insufficient quantity for product ${product.name}, update the inventory before updating the order.`,
      );
    }

    await product.save();
  }
};

/**
 * Creates a new order in pending status
 * @param {Object} orderData - Order data including products, customer info, and other details
 * @param {Array} orderData.products - Array of products with their quantities
 * @param {string} orderData.customerName - Name of the customer
 * @param {string} orderData.status - Order status (defaults to 'Pending')
 * @returns {Promise<Object>} Created order document
 */
exports.createOrder = async (orderData) => {
  // Orders start as Pending by default, no quantity updates needed
  const order = new Order(orderData);
  return await order.save();
};

/**
 * Updates an existing order and manages inventory based on status changes
 * @param {string} orderId - MongoDB ID of the order to update
 * @param {Object} updateData - Data to update the order with
 * @param {string} [updateData.status] - New status of the order
 * @returns {Promise<Object|null>} Updated order document or null if not found
 * @throws {Error} When inventory adjustment fails
 */
exports.updateOrder = async (orderId, updateData) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return null;
  }

  const oldStatus = order.status;
  const newStatus = updateData.status;

  // Handle quantity updates based on status changes
  if (
    oldStatus === "Pending" &&
    ["Processing", "Completed"].includes(newStatus)
  ) {
    // Subtract quantities when moving from Pending to Processing or Completed
    await updateProductQuantities(order.products, false);
  } else if (
    ["Processing", "Completed"].includes(oldStatus) &&
    newStatus === "Cancelled"
  ) {
    // Add quantities back when cancelling from Processing or Completed
    await updateProductQuantities(order.products, true);
  } else if (
    oldStatus === "Cancelled" &&
    ["Processing", "Completed"].includes(newStatus)
  ) {
    // Subtract quantities when reactivating a cancelled order
    await updateProductQuantities(order.products, false);
  } else if (
    ["Processing", "Completed"].includes(oldStatus) &&
    newStatus === "Pending"
  ) {
    // Add quantities back when returning to Pending status
    await updateProductQuantities(order.products, true);
  }

  Object.assign(order, updateData);
  return await order.save();
};

/**
 * Deletes an order and adjusts inventory if necessary
 * @param {string} orderId - MongoDB ID of the order to delete
 * @returns {Promise<Object>} Deleted order document
 * @throws {Error} When order is not found or inventory adjustment fails
 */
exports.deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // If deleting a Processing or Completed order, return quantities to inventory
  if (["Processing", "Completed"].includes(order.status)) {
    await updateProductQuantities(order.products, true);
  }

  return await Order.findByIdAndDelete(orderId);
};
