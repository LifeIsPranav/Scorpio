const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithProducts,
  reorderCategories,
  getCategoryAnalytics
} = require('../controllers/categoryController');
const { authenticateAdmin, requirePermission } = require('../middleware/authMiddleware');
const {
  validateCategory,
  validateCategoryUpdate
} = require('../middleware/validationMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// @route   GET /api/admin/categories/analytics
router.get('/analytics', requirePermission('categories.read'), getCategoryAnalytics);

// @route   PUT /api/admin/categories/reorder
router.put('/reorder', requirePermission('categories.update'), reorderCategories);

// @route   GET /api/admin/categories
router.get('/', requirePermission('categories.read'), getCategories);

// @route   GET /api/admin/categories/:id
router.get('/:id', requirePermission('categories.read'), getCategory);

// @route   GET /api/admin/categories/:id/products
router.get('/:id/products', requirePermission('categories.read'), getCategoryWithProducts);

// @route   POST /api/admin/categories
router.post('/', requirePermission('categories.create'), validateCategory, createCategory);

// @route   PUT /api/admin/categories/:id
router.put('/:id', requirePermission('categories.update'), validateCategoryUpdate, updateCategory);

// @route   DELETE /api/admin/categories/:id
router.delete('/:id', requirePermission('categories.delete'), deleteCategory);

module.exports = router;
