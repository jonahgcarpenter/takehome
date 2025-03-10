const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const updateProductQuantities = async (products, increase = false) => {
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product ${item.product} not found`);
    }
    
    const quantityChange = increase ? item.quantity : -item.quantity;
    product.quantity += quantityChange;
    
    if (product.quantity < 0) {
      throw new Error(`Insufficient quantity for product ${product.name}`);
    }
    
    await product.save();
  }
};

exports.createOrder = async (orderData) => {
  // Orders start as Pending by default, no quantity updates needed
  const order = new Order(orderData);
  return await order.save();
};

exports.updateOrder = async (orderId, updateData) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return null;
  }

  const oldStatus = order.status;
  const newStatus = updateData.status;

  // Handle quantity updates based on status changes
  if (oldStatus === 'Pending' && ['Processing', 'Completed'].includes(newStatus)) {
    // Subtract quantities when moving from Pending to Processing or Completed
    await updateProductQuantities(order.products, false);
  } else if (['Processing', 'Completed'].includes(oldStatus) && newStatus === 'Cancelled') {
    // Add quantities back when cancelling from Processing or Completed
    await updateProductQuantities(order.products, true);
  } else if (oldStatus === 'Cancelled' && ['Processing', 'Completed'].includes(newStatus)) {
    // Subtract quantities when reactivating a cancelled order
    await updateProductQuantities(order.products, false);
  } else if (['Processing', 'Completed'].includes(oldStatus) && newStatus === 'Pending') {
    // Add quantities back when returning to Pending status
    await updateProductQuantities(order.products, true);
  }

  Object.assign(order, updateData);
  return await order.save();
};

exports.deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // If deleting a Processing or Completed order, return quantities to inventory
  if (['Processing', 'Completed'].includes(order.status)) {
    await updateProductQuantities(order.products, true);
  }

  return await Order.findByIdAndDelete(orderId);
};
