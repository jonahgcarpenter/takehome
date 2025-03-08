// Buisness logic for creating and deleting orders.
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

/**
 * Helper to determine if transactions are supported.
 * Returns true if the MongoDB client is connected to a replica set.
 */
function canUseTransactions() {
  // Check if a replicaSet option is defined on the client's options
  return !!(
    mongoose.connection.client &&
    mongoose.connection.client.s &&
    mongoose.connection.client.s.options &&
    mongoose.connection.client.s.options.replicaSet
  );
}

/**
 * Creates an order and deducts the ordered quantities from the product stock.
 * Uses transactions only if supported.
 * @param {Object} orderData - The order data containing customer and products.
 * @returns {Object} - The created order.
 * @throws Will throw an error if a product is not found or stock is insufficient.
 */
async function createOrder(orderData) {
  let session = null;
  const useTransaction = canUseTransactions();

  if (useTransaction) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // Loop over each ordered item and update the corresponding product's quantity.
    for (const item of orderData.products) {
      const query = Product.findById(item.product);
      if (useTransaction) {
        query.session(session);
      }
      const product = await query.exec();
      if (!product) {
        throw new Error(`Product with id ${item.product} not found`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.name}`);
      }
      // Subtract the ordered quantity from the product's quantity.
      product.quantity -= item.quantity;
      if (useTransaction) {
        await product.save({ session });
      } else {
        await product.save();
      }
    }

    // Create the new order.
    const order = new Order(orderData);
    if (useTransaction) {
      await order.save({ session });
      await session.commitTransaction();
    } else {
      await order.save();
    }
    return order;
  } catch (error) {
    if (useTransaction && session) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    if (useTransaction && session) {
      session.endSession();
    }
  }
}

/**
 * Deletes an order and adds back the ordered quantities to the corresponding products.
 * Uses transactions only if supported.
 * @param {String} orderId - The ID of the order to be deleted.
 * @returns {Object} - The deleted order.
 * @throws Will throw an error if the order is not found.
 */
async function deleteOrder(orderId) {
  let session = null;
  const useTransaction = canUseTransactions();

  if (useTransaction) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    const query = Order.findById(orderId);
    if (useTransaction) {
      query.session(session);
    }
    const order = await query.exec();
    if (!order) {
      throw new Error("Order not found");
    }

    // For each item in the order, add back the quantity to the product.
    for (const item of order.products) {
      const productQuery = Product.findById(item.product);
      if (useTransaction) {
        productQuery.session(session);
      }
      const product = await productQuery.exec();
      if (product) {
        product.quantity += item.quantity;
        if (useTransaction) {
          await product.save({ session });
        } else {
          await product.save();
        }
      }
    }

    // Delete the order.
    const deleteQuery = Order.findByIdAndDelete(orderId);
    if (useTransaction) {
      deleteQuery.session(session);
      await deleteQuery.exec();
      await session.commitTransaction();
    } else {
      await deleteQuery.exec();
    }
    return order;
  } catch (error) {
    if (useTransaction && session) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    if (useTransaction && session) {
      session.endSession();
    }
  }
}

module.exports = {
  createOrder,
  deleteOrder,
};
