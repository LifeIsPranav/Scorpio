const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get featured products for homepage
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const products = await Product.findFeatured(parseInt(limit));

  res.status(200).json({
    success: true,
    data: products
  });
});

// @desc    Get premium products for homepage
// @route   GET /api/products/premium
// @access  Public
const getPremiumProducts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const products = await Product.findPremium(parseInt(limit));

  res.status(200).json({
    success: true,
    data: products
  });
});

// @desc    Get custom products for homepage
// @route   GET /api/products/custom
// @access  Public
const getCustomProducts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const products = await Product.findCustom(parseInt(limit));

  res.status(200).json({
    success: true,
    data: products
  });
});

// @desc    Get all products for public view
// @route   GET /api/products
// @access  Public
const getPublicProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 100, // Increased default limit to show more products
    category,
    search,
    featured,
    premium,
    custom,
    sort = 'createdAt',
    order = 'desc',
    minPrice,
    maxPrice
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

  // Filter by custom
  if (custom !== undefined) {
    query.custom = custom === 'true';
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.priceNumeric = {};
    if (minPrice) query.priceNumeric.$gte = parseInt(minPrice);
    if (maxPrice) query.priceNumeric.$lte = parseInt(maxPrice);
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
    case 'popularity':
      sortObj = { views: sortOrder, featured: -1 };
      break;
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    case 'oldest':
      sortObj = { createdAt: 1 };
      break;
    default:
      sortObj = { featured: -1, createdAt: -1 };
  }

  // Execute query
  const products = await Product.find(query)
    .sort(sortObj)
    .limit(limitNum)
    .skip(skip)
    .select('-__v');

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

// @desc    Get single product for public view
// @route   GET /api/products/:id
// @access  Public
const getPublicProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Try to find by _id first, if it fails (invalid ObjectId), try by slug
  let query;
  
  // Check if the id is a valid MongoDB ObjectId
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // It's a valid ObjectId, search by _id
    query = { _id: id, isActive: true };
  } else {
    // It's not a valid ObjectId, search by slug
    query = { slug: id, isActive: true };
  }

  const product = await Product.findOne(query).select('-__v');

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  // Increment views
  await product.incrementViews();

  // Get related products from the same category
  const relatedProducts = await Product.find({
    category: product.category,
    isActive: true,
    _id: { $ne: product._id }
  })
    .limit(4)
    .select('name slug price images category featured premium description priceNumeric tags custom')
    .sort({ featured: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      product,
      relatedProducts
    }
  });
});

// @desc    Get products by category for public view
// @route   GET /api/categories/:categoryId/products
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const {
    page = 1,
    limit = 12,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  // Check if category exists
  const category = await Category.findByIdentifier(categoryId);
  if (!category || !category.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
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
    case 'popularity':
      sortObj = { views: sortOrder, featured: -1 };
      break;
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    default:
      sortObj = { featured: -1, order: 1, createdAt: -1 };
  }

  // Get products
  const products = await Product.find({
    category: category.slug,
    isActive: true
  })
    .sort(sortObj)
    .limit(limitNum)
    .skip(skip)
    .select('-__v');

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

// @desc    Get all categories for public view
// @route   GET /api/categories
// @access  Public
const getPublicCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .select('-__v');

  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get single category for public view
// @route   GET /api/categories/:id
// @access  Public
const getPublicCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdentifier(req.params.id);

  if (!category || !category.isActive) {
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

// @desc    Search products
// @route   GET /api/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const { q: query, limit = 10 } = req.query;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Search query must be at least 2 characters long'
    });
  }

  const searchTerm = query.trim();
  const limitNum = Math.min(parseInt(limit), 50); // Max 50 results

  // Search products
  const products = await Product.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  })
    .limit(limitNum)
    .select('name slug price images category featured premium description priceNumeric tags custom')
    .sort({ featured: -1, views: -1, createdAt: -1 });

  // Search categories
  const categories = await Category.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  })
    .limit(5)
    .select('name description image slug')
    .sort({ productCount: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      products,
      categories,
      query: searchTerm,
      totalResults: products.length + categories.length
    }
  });
});

// @desc    Get homepage data
// @route   GET /api/homepage
// @access  Public
const getHomepageData = asyncHandler(async (req, res) => {
  // Get featured products
  const featuredProducts = await Product.findFeatured(6);

  // Get premium products
  const premiumProducts = await Product.findPremium(8);

  // Get categories
  const categories = await Category.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .limit(8)
    .select('name description image slug productCount');

  // Get latest products
  const latestProducts = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .select('name slug price images category featured premium description priceNumeric tags custom');

  res.status(200).json({
    success: true,
    data: {
      featuredProducts,
      premiumProducts,
      categories,
      latestProducts
    }
  });
});

// @desc    Get reviews for a specific product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  // Try to find product by _id first, if it fails, try by slug
  let product;
  
  if (productId.match(/^[0-9a-fA-F]{24}$/)) {
    // It's a valid ObjectId, search by _id
    product = await Product.findOne({ _id: productId, isActive: true });
  } else {
    // It's not a valid ObjectId, search by slug
    product = await Product.findOne({ slug: productId, isActive: true });
  }

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object
  const sortOrder = order === 'desc' ? -1 : 1;
  let sortObj = {};

  switch (sort) {
    case 'rating':
      sortObj = { rating: sortOrder };
      break;
    case 'createdAt':
      sortObj = { createdAt: sortOrder };
      break;
    default:
      sortObj = { createdAt: -1 };
  }

  // Get reviews for this product (only visible ones for public)
  const reviews = await Review.find({
    productId: product._id,
    isVisible: true
  })
    .sort(sortObj)
    .limit(limitNum)
    .skip(skip)
    .populate('productId', 'name slug')
    .select('-__v');

  // Get total count for pagination
  const totalReviews = await Review.countDocuments({
    productId: product._id,
    isVisible: true
  });

  // Calculate review statistics
  const reviewStats = await Review.aggregate([
    {
      $match: {
        productId: product._id,
        isVisible: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  // Calculate rating distribution
  let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (reviewStats.length > 0) {
    reviewStats[0].ratingDistribution.forEach(rating => {
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });
  }

  const totalPages = Math.ceil(totalReviews / limitNum);

  res.status(200).json({
    success: true,
    data: {
      reviews,
      stats: {
        averageRating: reviewStats.length > 0 ? Math.round(reviewStats[0].averageRating * 10) / 10 : 0,
        totalReviews,
        ratingDistribution: ratingCounts
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalReviews,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }
  });
});

// @desc    Submit a customer review for a product
// @route   POST /api/products/:productId/reviews
// @access  Public
const submitCustomerReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { customerName, customerPhone, rating, title, comment, images } = req.body;

  // Basic validation
  if (!customerName || !rating || !comment) {
    return res.status(400).json({
      success: false,
      message: 'Customer name, rating, and comment are required'
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  // Find the product (by slug or ObjectId)
  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    // If not found by ID, try by slug
    product = await Product.findOne({ slug: productId });
  }

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Create the review
  const review = new Review({
    productId: product._id,
    customerName: customerName.trim(),
    customerPhone: customerPhone ? customerPhone.trim() : undefined,
    rating: parseInt(rating),
    title: title ? title.trim() : '',
    comment: comment.trim(),
    images: images || [],
    isVerified: false, // Customer submissions are not verified by default
    isVisible: true // Show customer reviews by default (can be moderated later)
  });

  await review.save();

  // Populate the product details for response
  await review.populate('productId', 'name slug images');

  res.status(201).json({
    success: true,
    data: review,
    message: 'Thank you for your review! It has been submitted successfully.'
  });
});

module.exports = {
  getFeaturedProducts,
  getPremiumProducts,
  getCustomProducts,
  getPublicProducts,
  getPublicProduct,
  getProductsByCategory,
  getPublicCategories,
  getPublicCategory,
  searchProducts,
  getHomepageData,
  getProductReviews,
  submitCustomerReview
};
