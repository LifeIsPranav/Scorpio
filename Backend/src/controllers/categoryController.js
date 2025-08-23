const Category = require('../models/Category');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const { search, sort = 'order', order = 'asc' } = req.query;

  // Build query
  const query = { isActive: true };

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sortOrder = order === 'desc' ? -1 : 1;
  let sortObj = {};

  switch (sort) {
    case 'name':
      sortObj = { name: sortOrder };
      break;
    case 'createdAt':
      sortObj = { createdAt: sortOrder };
      break;
    case 'updatedAt':
      sortObj = { updatedAt: sortOrder };
      break;
    case 'order':
      sortObj = { order: sortOrder, createdAt: 1 };
      break;
    default:
      sortObj = { order: 1, createdAt: 1 };
  }

  // Execute query
  const categories = await Category.find(query).sort(sortObj);

  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/admin/categories/:id
// @access  Private
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdentifier(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, image, order = 0 } = req.body;

  // Check if category with same name already exists
  const existingCategory = await Category.findOne({
    name: new RegExp('^' + name + '$', 'i')
  });

  if (existingCategory) {
    return res.status(400).json({
      success: false,
      error: 'Category with this name already exists'
    });
  }

  // Create category
  const category = await Category.create({
    name,
    slug,
    description,
    image,
    order
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findByIdentifier(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }

  // If name is being updated, check for duplicates
  if (req.body.name && req.body.name !== category.name) {
    const existingCategory = await Category.findOne({
      name: new RegExp('^' + req.body.name + '$', 'i'),
      _id: { $ne: category._id }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name already exists'
      });
    }
  }

  // Update category
  Object.assign(category, req.body);
  await category.save();

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdentifier(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }

  // Check if category has products
  const productCount = await Product.countDocuments({
    category: category.slug,
    isActive: true
  });

  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      error: `Cannot delete category. It has ${productCount} active products. Please move or delete the products first.`
    });
  }

  // Soft delete by setting isActive to false
  category.isActive = false;
  await category.save();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    data: category
  });
});

// @desc    Get category with products
// @route   GET /api/admin/categories/:id/products
// @access  Private
const getCategoryWithProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const category = await Category.findByIdentifier(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get products in this category
  const products = await Product.find({
    category: category.slug,
    isActive: true
  })
    .sort({ order: 1, createdAt: -1 })
    .limit(limitNum)
    .skip(skip);

  const totalProducts = await Product.countDocuments({
    category: category.slug,
    isActive: true
  });

  const totalPages = Math.ceil(totalProducts / limitNum);

  res.status(200).json({
    success: true,
    data: {
      category,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalProducts,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }
  });
});

// @desc    Reorder categories
// @route   PUT /api/admin/categories/reorder
// @access  Private
const reorderCategories = asyncHandler(async (req, res) => {
  const { categoryIds } = req.body;

  if (!categoryIds || !Array.isArray(categoryIds)) {
    return res.status(400).json({
      success: false,
      error: 'Category IDs array is required'
    });
  }

  // Update order for each category
  const updatePromises = categoryIds.map((categoryId, index) =>
    Category.findByIdAndUpdate(categoryId, { order: index })
  );

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'Categories reordered successfully'
  });
});

// @desc    Get category analytics
// @route   GET /api/admin/categories/analytics
// @access  Private
const getCategoryAnalytics = asyncHandler(async (req, res) => {
  // Get total categories
  const totalCategories = await Category.countDocuments({ isActive: true });

  // Get categories with product counts
  const categoriesWithCounts = await Category.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $lookup: {
        from: 'products',
        let: { categorySlug: '$slug' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$category', '$$categorySlug'] },
                  { $eq: ['$isActive', true] }
                ]
              }
            }
          }
        ],
        as: 'products'
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        productCount: { $size: '$products' },
        createdAt: 1
      }
    },
    {
      $sort: { productCount: -1 }
    }
  ]);

  // Calculate average products per category
  const totalProducts = categoriesWithCounts.reduce(
    (sum, cat) => sum + cat.productCount,
    0
  );
  const averageProductsPerCategory = totalCategories > 0 
    ? Math.round(totalProducts / totalCategories * 100) / 100
    : 0;

  // Find categories without products
  const emptyCategoriesCount = categoriesWithCounts.filter(
    cat => cat.productCount === 0
  ).length;

  res.status(200).json({
    success: true,
    data: {
      totalCategories,
      totalProducts,
      averageProductsPerCategory,
      emptyCategoriesCount,
      categoriesWithProducts: categoriesWithCounts,
      topCategories: categoriesWithCounts.slice(0, 5)
    }
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithProducts,
  reorderCategories,
  getCategoryAnalytics
};
