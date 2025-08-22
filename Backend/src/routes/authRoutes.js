const express = require('express');
const {
  loginAdmin,
  verifyToken,
  getProfile,
  updateProfile,
  changePassword,
  createDefaultAdmin,
  logoutAdmin
} = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { validateAdminLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

// @route   POST /api/auth/login
router.post('/login', validateAdminLogin, loginAdmin);

// @route   GET /api/auth/verify
router.get('/verify', authenticateAdmin, verifyToken);

// @route   GET /api/auth/profile
router.get('/profile', authenticateAdmin, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', authenticateAdmin, updateProfile);

// @route   PUT /api/auth/change-password
router.put('/change-password', authenticateAdmin, changePassword);

// @route   POST /api/auth/logout
router.post('/logout', authenticateAdmin, logoutAdmin);

// Development only - create default admin
// @route   POST /api/auth/create-default
router.post('/create-default', createDefaultAdmin);

module.exports = router;
