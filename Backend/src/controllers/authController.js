const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if admin exists
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check if account is active
  if (!admin.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Account is deactivated'
    });
  }

  // Check password
  try {
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    if (error.message === 'Account is temporarily locked') {
      return res.status(423).json({
        success: false,
        error: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }
    throw error;
  }
});

// @desc    Verify admin token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = asyncHandler(async (req, res) => {
  // req.admin is set by the authenticateAdmin middleware
  res.status(200).json({
    success: true,
    user: {
      id: req.admin._id,
      username: req.admin.username,
      role: req.admin.role,
      permissions: req.admin.permissions,
      lastLogin: req.admin.lastLogin
    }
  });
});

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password');

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findById(req.admin._id);

  if (email !== undefined) {
    admin.email = email;
  }

  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: admin
  });
});

// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 6 characters'
    });
  }

  const admin = await Admin.findById(req.admin._id);

  // Verify current password
  const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  // Update password
  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Create default admin (development only)
// @route   POST /api/auth/create-default
// @access  Public (development only)
const createDefaultAdmin = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      error: 'This endpoint is only available in development mode'
    });
  }

  await Admin.createDefaultAdmin();

  res.status(201).json({
    success: true,
    message: 'Default admin created successfully'
  });
});

// @desc    Logout admin (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is typically handled client-side
  // by removing the token. We can optionally log this action.
  
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = {
  loginAdmin,
  verifyToken,
  getProfile,
  updateProfile,
  changePassword,
  createDefaultAdmin,
  logoutAdmin
};
