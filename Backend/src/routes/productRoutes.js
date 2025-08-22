const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
  getProductAnalytics
} = require('../controllers/productController');
const { authenticateAdmin, requirePermission } = require('../middleware/authMiddleware');
const {
  validateProduct,
  validateProductUpdate,
  validatePagination,
  validateObjectId
} = require('../middleware/validationMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// @route   GET /api/admin/products/analytics
router.get('/analytics', requirePermission('products.read'), getProductAnalytics);

// @route   GET /api/admin/products
router.get('/', requirePermission('products.read'), validatePagination, getProducts);

// @route   GET /api/admin/products/:id
router.get('/:id', requirePermission('products.read'), validateObjectId(), getProduct);

// @route   POST /api/admin/products
router.post('/', requirePermission('products.create'), validateProduct, createProduct);

// @route   PUT /api/admin/products/bulk
router.put('/bulk', requirePermission('products.update'), bulkUpdateProducts);

// @route   PUT /api/admin/products/:id
router.put('/:id', requirePermission('products.update'), validateObjectId(), validateProductUpdate, updateProduct);

// @route   DELETE /api/admin/products/:id
router.delete('/:id', requirePermission('products.delete'), validateObjectId(), deleteProduct);

module.exports = router;
