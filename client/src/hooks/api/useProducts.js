import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products (Admin/Staff/Customer)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific product by ID (Admin/Staff/Customer)
  const fetchProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new product (Admin/Staff only)
  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/products", productData);
      setProducts((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a product by ID (Admin/Staff only)
  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/products/${id}`, productData);
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? response.data : product)),
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product by ID (Admin/Staff only)
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts: useCallback(fetchProducts, []),
    fetchProductById: useCallback(fetchProductById, []),
    createProduct: useCallback(createProduct, []),
    updateProduct: useCallback(updateProduct, []),
    deleteProduct: useCallback(deleteProduct, []),
  };
};

export default useProducts;
