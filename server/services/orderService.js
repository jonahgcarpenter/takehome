// Buisness logic for creating and deleting orders.
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

/**
 * Creates an order and deducts the ordered quantities from the product stock.
 * @param {Object} orderData - The order data containing customer and products.
 * @returns {Object} - The created order.
 * @throws Will throw an error if a product is not found or stock is insufficient.
 */
async function createOrder(orderData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Loop over each ordered item and update the corresponding product's quantity.
    for (const item of orderData.products) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product with id ${item.product} not found`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.name}`);
      }
      // Subtract the ordered quantity from the product's quantity.
      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // Create the new order.
    const order = new Order(orderData);
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

/**
 * Deletes an order and adds back the ordered quantities to the corresponding products.
 * @param {String} orderId - The ID of the order to be deleted.
 * @returns {Object} - The deleted order.
 * @throws Will throw an error if the order is not found.
 */
async function deleteOrder(orderId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found");
    }

    // For each item in the order, add back the quantity to the product.
    for (const item of order.products) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        product.quantity += item.quantity;
        await product.save({ session });
      }
    }

    // Delete the order.
    await Order.findByIdAndDelete(orderId).session(session);

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

module.exports = {
  createOrder,
  deleteOrder,
};
