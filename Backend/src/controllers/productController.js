const Product = require('../models/Product');
const Category = require('../models/Category');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/admin/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    search,
    featured,
    premium,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by featured
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  // Filter by premium
  if (premium !== undefined) {
    query.premium = premium === 'true';
  }

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object
  const sortOrder = order === 'desc' ? -1 : 1;
  let sortObj = {};

  switch (sort) {
    case 'name':
      sortObj = { name: sortOrder };
      break;
    case 'price':
      sortObj = { priceNumeric: sortOrder };
      break;
    case 'createdAt':
      sortObj = { createdAt: sortOrder };
      break;
    case 'updatedAt':
      sortObj = { updatedAt: sortOrder };
      break;
    case 'order':
      sortObj = { order: sortOrder, createdAt: -1 };
      break;
    default:
      sortObj = { createdAt: -1 };
  }

  // Execute query
  const products = await Product.find(query)
    .sort(sortObj)
    .limit(limitNum)
    .skip(skip)
    .populate('category', 'name slug');

  // Get total count for pagination
  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limitNum);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalProducts,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  });
});

// @desc    Get single product
// @route   GET /api/admin/products/:id
// @access  Private
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    images,
    category,
    featured = false,
    premium = false,
    whatsappMessage,
    tags = [],
    order = 0
  } = req.body;

  // Check if category exists
  const categoryExists = await Category.findOne({ slug: category });
  if (!categoryExists) {
    return res.status(400).json({
      success: false,
      error: 'Category not found'
    });
  }

  // Create product
  const product = await Product.create({
    name,
    description,
    price,
    images,
    category,
    featured,
    premium,
    whatsappMessage,
    tags,
    order
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  // If category is being updated, check if it exists
  if (req.body.category) {
    const categoryExists = await Category.findOne({ slug: req.body.category });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }
  }

  // Update product
  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  // Soft delete by setting isActive to false
  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: product
  });
});

// @desc    Bulk update products
// @route   PUT /api/admin/products/bulk
// @access  Private
const bulkUpdateProducts = asyncHandler(async (req, res) => {
  const { productIds, updates } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Product IDs are required'
    });
  }

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Updates are required'
    });
  }

  // If category is being updated, check if it exists
  if (updates.category) {
    const categoryExists = await Category.findOne({ slug: updates.category });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }
  }

  // Update products
  const result = await Product.updateMany(
    { _id: { $in: productIds }, isActive: true },
    updates,
    { runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} products updated successfully`,
    data: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    }
  });
});

// @desc    Get product analytics
// @route   GET /api/admin/products/analytics
// @access  Private
const getProductAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Product.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        featuredProducts: {
          $sum: { $cond: ['$featured', 1, 0] }
        },
        premiumProducts: {
          $sum: { $cond: ['$premium', 1, 0] }
        },
        averagePrice: { $avg: '$priceNumeric' },
        totalViews: { $sum: '$views' }
      }
    }
  ]);

  // Get products by category
  const productsByCategory = await Product.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'slug',
        as: 'categoryInfo'
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        name: { $arrayElemAt: ['$categoryInfo.name', 0] },
        count: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: analytics[0] || {
        totalProducts: 0,
        featuredProducts: 0,
        premiumProducts: 0,
        averagePrice: 0,
        totalViews: 0
      },
      productsByCategory
    }
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
  getProductAnalytics
};
