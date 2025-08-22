const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    validate: {
      validator: function(v) {
        return /^[a-z0-9_]+$/.test(v);
      },
      message: 'Username can only contain lowercase letters, numbers, and underscores'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to be unique
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'editor'],
    default: 'admin'
  },
  permissions: [{
    type: String,
    enum: [
      'products.read',
      'products.create',
      'products.update',
      'products.delete',
      'categories.read',
      'categories.create',
      'categories.update',
      'categories.delete',
      'admins.read',
      'admins.create',
      'admins.update',
      'admins.delete',
      'analytics.read',
      'settings.read',
      'settings.update'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0,
    max: 5
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
adminSchema.index({ username: 1 });
adminSchema.index({ email: 1 });
adminSchema.index({ isActive: 1 });

// Virtual for account lock status
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked');
  }

  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  
  if (isMatch) {
    // Reset login attempts on successful login
    if (this.loginAttempts > 0) {
      this.loginAttempts = 0;
      this.lockUntil = undefined;
      await this.save();
    }
    
    // Update last login
    this.lastLogin = new Date();
    await this.save();
    
    return true;
  } else {
    // Increment login attempts
    this.loginAttempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (this.loginAttempts >= 5) {
      this.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
    }
    
    await this.save();
    return false;
  }
};

// Instance method to check permissions
adminSchema.methods.hasPermission = function(permission) {
  if (this.role === 'admin') {
    return true; // Admin has all permissions
  }
  return this.permissions.includes(permission);
};

// Static method to create default admin
adminSchema.statics.createDefaultAdmin = async function() {
  try {
    const adminExists = await this.findOne({ username: 'admin' });
    if (!adminExists) {
      const defaultAdmin = new this({
        username: process.env.ADMIN_DEFAULT_USERNAME || 'admin',
        password: process.env.ADMIN_DEFAULT_PASSWORD || 'admin123',
        role: 'admin',
        permissions: [
          'products.read', 'products.create', 'products.update', 'products.delete',
          'categories.read', 'categories.create', 'categories.update', 'categories.delete',
          'admins.read', 'admins.create', 'admins.update', 'admins.delete',
          'analytics.read', 'settings.read', 'settings.update'
        ]
      });
      
      await defaultAdmin.save();
      console.log('🔐 Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

// Static method to get role permissions
adminSchema.statics.getRolePermissions = function(role) {
  const rolePermissions = {
    admin: [
      'products.read', 'products.create', 'products.update', 'products.delete',
      'categories.read', 'categories.create', 'categories.update', 'categories.delete',
      'admins.read', 'admins.create', 'admins.update', 'admins.delete',
      'analytics.read', 'settings.read', 'settings.update'
    ],
    manager: [
      'products.read', 'products.create', 'products.update', 'products.delete',
      'categories.read', 'categories.create', 'categories.update', 'categories.delete',
      'analytics.read'
    ],
    editor: [
      'products.read', 'products.create', 'products.update',
      'categories.read'
    ]
  };
  
  return rolePermissions[role] || [];
};

module.exports = mongoose.model('Admin', adminSchema);
