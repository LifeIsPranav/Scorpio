const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: String,
    required: [true, 'Product price is required'],
    validate: {
      validator: function(v) {
        return /^₹[\d,]+$/.test(v);
      },
      message: 'Price must be in format ₹X,XXX'
    }
  },
  priceNumeric: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // More flexible URL validation for modern image services
        return /^https?:\/\/.+/i.test(v) && 
               (v.includes('images.unsplash.com') || 
                v.includes('cdn.') || 
                /\.(jpg|jpeg|png|webp|gif)$/i.test(v) ||
                /\.(jpg|jpeg|png|webp|gif)\?/i.test(v));
      },
      message: 'Please provide a valid image URL'
    }
  }],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    ref: 'Category'
  },
  featured: {
    type: Boolean,
    default: false
  },
  premium: {
    type: Boolean,
    default: false
  },
  custom: {
    type: Boolean,
    default: false
  },
  customFields: [{
    fieldName: {
      type: String,
      required: false, // Remove the dynamic requirement for now
      trim: true,
      maxlength: [100, 'Field name cannot exceed 100 characters']
    },
    fieldType: {
      type: String,
      enum: ['dropdown', 'radio', 'checkbox', 'text'],
      required: false, // Remove the dynamic requirement for now  
      default: 'dropdown'
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [{
      label: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Option label cannot exceed 50 characters']
      },
      value: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Option value cannot exceed 50 characters']
      },
      priceModifier: {
        type: Number,
        default: 0,
        min: [0, 'Price modifier cannot be negative']
      }
    }],
    placeholder: {
      type: String,
      trim: true,
      maxlength: [100, 'Placeholder cannot exceed 100 characters']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  whatsappMessage: {
    type: String,
    maxlength: [500, 'WhatsApp message cannot exceed 500 characters'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  keyFeatures: [{
    icon: {
      type: String,
      trim: true,
      default: 'Star'
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Feature title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Feature description cannot exceed 200 characters']
    }
  }],
  specifications: {
    general: {
      brand: {
        type: String,
        trim: true,
        maxlength: [50, 'Brand name cannot exceed 50 characters'],
        default: 'Scorpio Premium'
      },
      sku: {
        type: String,
        trim: true,
        maxlength: [20, 'SKU cannot exceed 20 characters']
      },
      warranty: {
        type: String,
        trim: true,
        maxlength: [50, 'Warranty cannot exceed 50 characters'],
        default: '2 Years'
      },
      availability: {
        type: String,
        trim: true,
        maxlength: [20, 'Availability cannot exceed 20 characters'],
        default: 'In Stock'
      }
    },
    details: {
      weight: {
        type: String,
        trim: true,
        maxlength: [20, 'Weight cannot exceed 20 characters'],
        default: '1.2 kg'
      },
      dimensions: {
        type: String,
        trim: true,
        maxlength: [50, 'Dimensions cannot exceed 50 characters'],
        default: '25 × 15 × 8 cm'
      },
      material: {
        type: String,
        trim: true,
        maxlength: [50, 'Material cannot exceed 50 characters'],
        default: 'Premium Grade'
      },
      color: {
        type: String,
        trim: true,
        maxlength: [30, 'Color cannot exceed 30 characters']
      }
    }
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance (keep non-unique indexes)
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ premium: 1, isActive: 1 });
productSchema.index({ custom: 1, isActive: 1 });
productSchema.index({ priceNumeric: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for id (to maintain frontend compatibility)
productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Pre-save middleware to generate slug and extract numeric price
productSchema.pre('save', function(next) {
  // Generate slug from name
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Extract numeric price from formatted price
  if (this.isModified('price')) {
    const priceMatch = this.price.match(/₹([\d,]+)/);
    if (priceMatch) {
      this.priceNumeric = parseInt(priceMatch[1].replace(/,/g, ''));
    }
  }

  // Generate default WhatsApp message if not provided
  if (!this.whatsappMessage) {
    this.whatsappMessage = `Hi! I'm interested in the ${this.name}. Could you tell me more about it?`;
  }

  // Generate SKU if not provided
  if (!this.specifications?.general?.sku) {
    if (!this.specifications) this.specifications = {};
    if (!this.specifications.general) this.specifications.general = {};
    this.specifications.general.sku = `SP-${this._id.toString().slice(-4).toUpperCase()}`;
  }

  next();
});

// Post-save middleware to update category product count
productSchema.post('save', async function() {
  if (this.category) {
    const Category = mongoose.model('Category');
    const category = await Category.findOne({ slug: this.category });
    if (category) {
      await category.updateProductCount();
    }
  }
});

// Post-remove middleware to update category product count
productSchema.post('deleteOne', { document: true }, async function() {
  if (this.category) {
    const Category = mongoose.model('Category');
    const category = await Category.findOne({ slug: this.category });
    if (category) {
      await category.updateProductCount();
    }
  }
});

// Static method to find featured products
productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ featured: true, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit);
};

// Static method to find premium products
productSchema.statics.findPremium = function(limit = 10) {
  return this.find({ premium: true, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit);
};

// Static method to find custom products
productSchema.statics.findCustom = function(limit = 10) {
  return this.find({ custom: true, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit);
};

// Static method to find by category
productSchema.statics.findByCategory = function(categorySlug, options = {}) {
  const query = { category: categorySlug, isActive: true };
  
  return this.find(query)
    .sort(options.sort || { order: 1, createdAt: -1 })
    .limit(options.limit || 0)
    .skip(options.skip || 0);
};

// Instance method to increment views
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Pre-save validation for custom fields
productSchema.pre('save', function(next) {
  // If this is a custom product, validate that required custom fields are present
  if (this.custom && this.customFields.length > 0) {
    for (let field of this.customFields) {
      if (!field.fieldName || !field.fieldType) {
        return next(new Error('Custom fields must have fieldName and fieldType when product is marked as custom'));
      }
    }
  }
  next();
});

// Pre-validate for updates
productSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.custom && update.customFields && update.customFields.length > 0) {
    for (let field of update.customFields) {
      if (!field.fieldName || !field.fieldType) {
        return next(new Error('Custom fields must have fieldName and fieldType when product is marked as custom'));
      }
    }
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
