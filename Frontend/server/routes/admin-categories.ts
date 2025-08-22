import { RequestHandler } from "express";
import { categories } from "../../shared/data"; // This would be replaced with a real database

// In-memory storage for demo purposes - in production, use a real database
let categoryData = [...categories];

export const getCategories: RequestHandler = (req, res) => {
  try {
    const { search } = req.query;
    let filteredCategories = [...categoryData];

    // Filter by search term
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredCategories = filteredCategories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm) ||
          category.description.toLowerCase().includes(searchTerm),
      );
    }

    res.json({
      success: true,
      data: filteredCategories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCategory: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const category = categoryData.find((c) => c.id === id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createCategory: RequestHandler = (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Validation
    if (!name || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Required fields: name, description, image",
      });
    }

    // Check if category with same name already exists
    const existingCategory = categoryData.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const newCategory = {
      id: name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      name,
      description,
      image,
    };

    categoryData.push(newCategory);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCategory: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const categoryIndex = categoryData.findIndex((c) => c.id === id);
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Validation
    if (!name || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Required fields: name, description, image",
      });
    }

    // Check if another category with same name already exists
    const existingCategory = categoryData.find(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== id,
    );

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const updatedCategory = {
      ...categoryData[categoryIndex],
      name,
      description,
      image,
    };

    categoryData[categoryIndex] = updatedCategory;

    res.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCategory: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const categoryIndex = categoryData.findIndex((c) => c.id === id);

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const deletedCategory = categoryData.splice(categoryIndex, 1)[0];

    res.json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
