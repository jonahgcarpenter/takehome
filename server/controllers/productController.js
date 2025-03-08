// Handles CRUD operations for products
const Product = require("../models/productModel");

// GET /api/products
// Retrieve all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// GET /api/products/:id
// Retrieve a single product by its ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// POST /api/products
// Create a new product (Admin/Staff only)
exports.createProduct = async (req, res) => {
  try {
    // Destructure necessary fields from the request body.
    const { name, description, price, quantity } = req.body;
    // Create a new product instance.
    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
    });
    // Save the new product to the database.
    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// PUT /api/products/:id
// Update an existing product (Admin/Staff only)
exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find and update the product; { new: true } returns the updated document.
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/products/:id
// Delete a product (Admin/Staff only)
exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
