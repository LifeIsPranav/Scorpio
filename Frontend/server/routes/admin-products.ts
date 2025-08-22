import { RequestHandler } from "express";
import { products } from "../../shared/data"; // This would be replaced with a real database

// In-memory storage for demo purposes - in production, use a real database
let productData = [...products];

export const getProducts: RequestHandler = (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    let filteredProducts = [...productData];

    // Filter by category
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category,
      );
    }

    // Filter by search term
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm),
      );
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limitNum),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProduct: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const product = productData.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createProduct: RequestHandler = (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      featured,
      images,
      whatsappMessage,
    } = req.body;

    // Validation
    if (!name || !description || !price || !category || !images?.length) {
      return res.status(400).json({
        success: false,
        message: "Required fields: name, description, price, category, images",
      });
    }

    const newProduct = {
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      price,
      category,
      featured: featured || false,
      images: Array.isArray(images) ? images : [images],
      whatsappMessage:
        whatsappMessage ||
        `Hi! I'm interested in ${name}. Could you tell me more about it?`,
    };

    productData.push(newProduct);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProduct: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      featured,
      images,
      whatsappMessage,
    } = req.body;

    const productIndex = productData.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validation
    if (!name || !description || !price || !category || !images?.length) {
      return res.status(400).json({
        success: false,
        message: "Required fields: name, description, price, category, images",
      });
    }

    const updatedProduct = {
      ...productData[productIndex],
      name,
      description,
      price,
      category,
      featured: featured || false,
      images: Array.isArray(images) ? images : [images],
      whatsappMessage:
        whatsappMessage ||
        `Hi! I'm interested in ${name}. Could you tell me more about it?`,
    };

    productData[productIndex] = updatedProduct;

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProduct: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = productData.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const deletedProduct = productData.splice(productIndex, 1)[0];

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
