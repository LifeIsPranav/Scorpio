const express = require('express');
const {
  getFeaturedProducts,
  getPremiumProducts,
  getPublicProducts,
  getPublicProduct,
  getProductsByCategory,
  getPublicCategories,
  getPublicCategory,
  searchProducts,
  getHomepageData,
  getProductReviews,
  submitCustomerReview
} = require('../controllers/publicController');
const { validatePagination, validateObjectId } = require('../middleware/validationMiddleware');

const router = express.Router();

// Homepage data endpoint
// @route   GET /api/homepage
router.get('/homepage', getHomepageData);

// Search endpoint
// @route   GET /api/search
router.get('/search', searchProducts);

// Product endpoints
// @route   GET /api/products/featured
router.get('/products/featured', getFeaturedProducts);

// @route   GET /api/products/premium
router.get('/products/premium', getPremiumProducts);

// @route   GET /api/products
router.get('/products', validatePagination, getPublicProducts);

// @route   GET /api/products/:id
router.get('/products/:id', getPublicProduct);

// Category endpoints
// @route   GET /api/categories
router.get('/categories', getPublicCategories);

// @route   GET /api/categories/:id
router.get('/categories/:id', getPublicCategory);

// @route   GET /api/categories/:categoryId/products
router.get('/categories/:categoryId/products', validatePagination, getProductsByCategory);

// @route   GET /api/products/:productId/reviews
router.get('/products/:productId/reviews', getProductReviews);

// @route   POST /api/products/:productId/reviews
router.post('/products/:productId/reviews', submitCustomerReview);

module.exports = router;
