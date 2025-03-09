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
 * Updates an order and adjusts product stock accordingly.
 * Compares the existing order's products to the new order data, and
 * updates product quantities based on the differences.
 * Uses transactions if supported.
 * @param {String} orderId - The ID of the order to update.
 * @param {Object} updatedData - The updated order data (including products array).
 * @returns {Object} - The updated order.
 * @throws Will throw an error if the order is not found or if stock is insufficient.
 */
async function updateOrder(orderId, updatedData) {
  let session = null;
  const useTransaction = canUseTransactions();

  if (useTransaction) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // Retrieve the existing order
    const existingOrder = await Order.findById(orderId).session(session);
    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Only update product stock if updatedData.products is provided
    if (updatedData.products) {
      // Build lookup maps for existing and updated products
      const oldProducts = {};
      existingOrder.products.forEach((item) => {
        oldProducts[item.product.toString()] = item.quantity;
      });
      const newProducts = {};
      updatedData.products.forEach((item) => {
        newProducts[item.product] = item.quantity;
      });

      // Create a set of all product IDs involved in the change
      const productIds = new Set([
        ...Object.keys(oldProducts),
        ...Object.keys(newProducts),
      ]);

      // Adjust product quantities based on differences
      for (const prodId of productIds) {
        const product = await Product.findById(prodId).session(session);
        if (!product) {
          throw new Error(`Product with id ${prodId} not found`);
        }

        const oldQty = oldProducts[prodId] || 0;
        const newQty = newProducts[prodId] || 0;
        const diff = newQty - oldQty; // positive: additional units required, negative: units to be returned

        if (diff > 0) {
          if (product.quantity < diff) {
            throw new Error(`Not enough stock for product: ${product.name}`);
          }
          product.quantity -= diff;
        } else if (diff < 0) {
          product.quantity += Math.abs(diff);
        }
        await product.save({ session });
      }
      // Update the order's products field if provided
      existingOrder.products = updatedData.products;
    }

    // Update other fields in updatedData
    for (const key in updatedData) {
      if (key !== "products") {
        existingOrder[key] = updatedData[key];
      }
    }
    await existingOrder.save({ session });

    if (useTransaction) {
      await session.commitTransaction();
    }
    return existingOrder;
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
  updateOrder,
  deleteOrder,
};
