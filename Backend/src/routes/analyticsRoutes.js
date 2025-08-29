const express = require('express');
const router = express.Router();
const {
  getAnalyticsDashboard,
  getSalesAnalytics,
  getCustomerAnalytics
} = require('../controllers/analyticsController');

const { authenticateAdmin, requirePermission } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateAdmin);

// @route   GET /api/admin/analytics
// @desc    Get comprehensive analytics dashboard
// @access  Private/Admin
router.get('/', requirePermission('analytics.read'), getAnalyticsDashboard);

// @route   GET /api/admin/analytics/sales
// @desc    Get sales analytics
// @access  Private/Admin
router.get('/sales', requirePermission('analytics.read'), getSalesAnalytics);

// @route   GET /api/admin/analytics/customers
// @desc    Get customer analytics
// @access  Private/Admin
router.get('/customers', requirePermission('analytics.read'), getCustomerAnalytics);

module.exports = router;
