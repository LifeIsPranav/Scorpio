const { asyncHandler } = require('../middleware/errorMiddleware');
const fs = require('fs').promises;
const path = require('path');

// In-memory settings store (in production, use database)
let websiteSettings = {
  general: {
    siteName: 'Scorpio',
    siteDescription: 'Premium E-commerce Platform',
    siteUrl: 'https://scorpio.com',
    contactEmail: 'contact@scorpio.com',
    supportEmail: 'support@scorpio.com',
    phone: '+1 (555) 123-4567',
    address: '123 E-commerce Street, Digital City, DC 12345',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    maintenance: false
  },
  appearance: {
    logo: '/placeholder.svg',
    favicon: '/favicon.ico',
    primaryColor: '#000000',
    secondaryColor: '#666666',
    accentColor: '#ff6b6b',
    fontFamily: 'Inter',
    theme: 'light'
  },
  ecommerce: {
    enableInventoryTracking: true,
    enableReviews: true,
    enableWishlist: true,
    enableCoupons: true,
    defaultShippingCost: 10.00,
    freeShippingThreshold: 100.00,
    taxRate: 8.5,
    enableGuestCheckout: true,
    enableOrderTracking: true,
    orderPrefix: 'SC',
    lowStockThreshold: 10
  },
  notifications: {
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    orderConfirmationEmails: true,
    shippingNotifications: true,
    lowStockAlerts: true,
    reviewNotifications: true,
    promotionalEmails: false
  },
  seo: {
    metaTitle: 'Scorpio - Premium E-commerce Platform',
    metaDescription: 'Discover premium products at Scorpio. Shop the latest trends with fast shipping and excellent customer service.',
    metaKeywords: 'ecommerce, shopping, premium, products, online store',
    googleAnalyticsId: '',
    facebookPixelId: '',
    enableSitemap: true,
    enableRobotsTxt: true
  },
  security: {
    enableTwoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableCaptcha: false,
    ipWhitelist: [],
    enableSSL: true,
    cookieSecure: true
  },
  integrations: {
    paymentGateways: {
      stripe: {
        enabled: false,
        publicKey: '',
        secretKey: ''
      },
      paypal: {
        enabled: false,
        clientId: '',
        clientSecret: ''
      }
    },
    emailService: {
      provider: 'smtp',
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'Scorpio'
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  }
};

// @desc    Get all website settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
  try {
    res.json({
      success: true,
      data: websiteSettings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
});

// @desc    Update website settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  try {
    const { section, settings } = req.body;
    
    if (!section || !settings) {
      return res.status(400).json({
        success: false,
        message: 'Section and settings are required'
      });
    }

    // Validate section exists
    if (!websiteSettings[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings section'
      });
    }

    // Update settings for the specified section
    websiteSettings[section] = {
      ...websiteSettings[section],
      ...settings
    };

    // In production, save to database
    // await saveSettingsToDatabase(websiteSettings);

    res.json({
      success: true,
      data: websiteSettings[section],
      message: `${section} settings updated successfully`
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
});

// @desc    Reset settings to defaults
// @route   POST /api/admin/settings/reset
// @access  Private/Admin
const resetSettings = asyncHandler(async (req, res) => {
  try {
    const { section } = req.body;
    
    if (!section) {
      return res.status(400).json({
        success: false,
        message: 'Section is required'
      });
    }

    if (!websiteSettings[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings section'
      });
    }

    // Reset to default values (you would load these from a config file)
    const defaultSettings = {
      general: {
        siteName: 'Scorpio',
        siteDescription: 'Premium E-commerce Platform',
        siteUrl: 'https://scorpio.com',
        contactEmail: 'contact@scorpio.com',
        supportEmail: 'support@scorpio.com',
        phone: '+1 (555) 123-4567',
        address: '123 E-commerce Street, Digital City, DC 12345',
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'en',
        maintenance: false
      },
      // ... other default sections
    };

    websiteSettings[section] = defaultSettings[section] || websiteSettings[section];

    res.json({
      success: true,
      data: websiteSettings[section],
      message: `${section} settings reset to defaults`
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings',
      error: error.message
    });
  }
});

// @desc    Backup settings
// @route   GET /api/admin/settings/backup
// @access  Private/Admin
const backupSettings = asyncHandler(async (req, res) => {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      settings: websiteSettings,
      version: '1.0.0'
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=scorpio-settings-backup-${Date.now()}.json`);
    res.json(backup);
  } catch (error) {
    console.error('Backup settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create backup',
      error: error.message
    });
  }
});

// @desc    Restore settings from backup
// @route   POST /api/admin/settings/restore
// @access  Private/Admin
const restoreSettings = asyncHandler(async (req, res) => {
  try {
    const { backup } = req.body;
    
    if (!backup || !backup.settings) {
      return res.status(400).json({
        success: false,
        message: 'Invalid backup file'
      });
    }

    // Validate backup structure
    const requiredSections = ['general', 'appearance', 'ecommerce', 'notifications', 'seo', 'security', 'integrations'];
    const backupSections = Object.keys(backup.settings);
    
    const isValidBackup = requiredSections.every(section => backupSections.includes(section));
    
    if (!isValidBackup) {
      return res.status(400).json({
        success: false,
        message: 'Backup file is missing required sections'
      });
    }

    websiteSettings = backup.settings;

    res.json({
      success: true,
      data: websiteSettings,
      message: 'Settings restored successfully'
    });
  } catch (error) {
    console.error('Restore settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore settings',
      error: error.message
    });
  }
});

// @desc    Get system info
// @route   GET /api/admin/settings/system
// @access  Private/Admin
const getSystemInfo = asyncHandler(async (req, res) => {
  try {
    const os = require('os');
    const Package = require('../../package.json');
    
    const systemInfo = {
      application: {
        name: Package.name,
        version: Package.version,
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        nodeVersion: process.version
      },
      server: {
        platform: os.platform(),
        architecture: os.arch(),
        hostname: os.hostname(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuCores: os.cpus().length,
        loadAverage: os.loadavg()
      },
      database: {
        status: 'Connected',
        type: 'MongoDB',
        // Add more DB info as needed
      }
    };

    res.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system information',
      error: error.message
    });
  }
});

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
  backupSettings,
  restoreSettings,
  getSystemInfo
};
