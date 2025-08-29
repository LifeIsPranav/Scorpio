const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  resetSettings,
  backupSettings,
  restoreSettings,
  getSystemInfo
} = require('../controllers/settingsController');

const { authenticateAdmin, requirePermission } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateAdmin);

// @route   GET /api/admin/settings
// @desc    Get all website settings
// @access  Private/Admin
router.get('/', requirePermission('settings.read'), getSettings);

// @route   PUT /api/admin/settings
// @desc    Update website settings
// @access  Private/Admin
router.put('/', requirePermission('settings.write'), updateSettings);

// @route   POST /api/admin/settings/reset
// @desc    Reset settings to defaults
// @access  Private/Admin
router.post('/reset', requirePermission('settings.write'), resetSettings);

// @route   GET /api/admin/settings/backup
// @desc    Backup settings
// @access  Private/Admin
router.get('/backup', requirePermission('settings.write'), backupSettings);

// @route   POST /api/admin/settings/restore
// @desc    Restore settings from backup
// @access  Private/Admin
router.post('/restore', requirePermission('settings.write'), restoreSettings);

// @route   GET /api/admin/settings/system
// @desc    Get system information
// @access  Private/Admin
router.get('/system', requirePermission('settings.read'), getSystemInfo);

module.exports = router;
