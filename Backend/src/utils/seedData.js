const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');

/**
 * Initialize database with sample data
 */
const initializeDatabase = async () => {
  try {
    console.log('🌱 Initializing database with sample data...');

    // Check if data already exists
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const orderCount = await Order.countDocuments();
    const reviewCount = await Review.countDocuments();

    if (productCount > 0 || categoryCount > 0 || orderCount > 0 || reviewCount > 0) {
      console.log('📊 Database already contains data. Skipping initialization.');
      return;
    }

    // Sample categories
    const sampleCategories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and tech accessories',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop&crop=center.jpg',
        order: 0
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center.jpg',
        order: 1
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Beautiful items for your living space',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center.jpg',
        order: 2
      },
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Equipment for active lifestyle',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center.jpg',
        order: 3
      }
    ];

    // Create categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`📦 Created ${createdCategories.length} categories`);

    // Sample products
    const sampleProducts = [
      {
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
        price: '₹12,999',
        priceNumeric: 12999,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center.jpg',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center.jpg'
        ],
        category: 'electronics',
        featured: true,
        premium: true,
        tags: ['wireless', 'headphones', 'audio', 'premium'],
        order: 0
      },
      {
        name: 'Smart Watch Series X',
        slug: 'smart-watch-series-x',
        description: 'Advanced fitness tracker with heart rate monitoring and GPS capabilities.',
        price: '₹24,999',
        priceNumeric: 24999,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center.jpg',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&crop=center.jpg'
        ],
        category: 'electronics',
        featured: true,
        premium: true,
        tags: ['smartwatch', 'fitness', 'tracker', 'gps'],
        order: 1
      },
      {
        name: 'Designer Leather Jacket',
        slug: 'designer-leather-jacket',
        description: 'Premium genuine leather jacket with modern cut and superior craftsmanship.',
        price: '₹8,999',
        priceNumeric: 8999,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&crop=center.jpg',
          'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&h=600&fit=crop&crop=center.jpg'
        ],
        category: 'fashion',
        featured: true,
        premium: true,
        tags: ['leather', 'jacket', 'fashion', 'designer'],
        order: 2
      },
      {
        name: 'Minimalist Desk Lamp',
        slug: 'minimalist-desk-lamp',
        description: 'Modern LED desk lamp with adjustable brightness and USB charging port.',
        price: '₹3,499',
        priceNumeric: 3499,
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center.jpg',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop&crop=center.jpg'
        ],
        category: 'home-garden',
        featured: false,
        tags: ['lamp', 'led', 'desk', 'minimalist'],
        order: 3
      },
      {
        name: 'Yoga Mat Pro',
        slug: 'yoga-mat-pro',
        description: 'Professional grade yoga mat with superior grip and eco-friendly materials.',
        price: '₹2,999',
        priceNumeric: 2999,
        images: [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center.jpg',
          'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&h=600&fit=crop&crop=center.jpg'
        ],
        category: 'sports-fitness',
        featured: false,
        tags: ['yoga', 'mat', 'fitness', 'eco-friendly'],
        order: 4
      },
      {
        name: 'Ceramic Plant Pot Set',
        slug: 'ceramic-plant-pot-set',
        description: 'Beautiful handcrafted ceramic pots perfect for indoor plants and succulents.',
        price: '₹1,999',
        priceNumeric: 1999,
        images: [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop&crop=center.jpg',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop&crop=center.jpg'
        ],
        category: 'home-garden',
        featured: false,
        tags: ['ceramic', 'pots', 'plants', 'handcrafted'],
        order: 5
      }
    ];

    // Create products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`🛍️ Created ${createdProducts.length} products`);

    // Update category product counts
    for (const category of createdCategories) {
      await category.updateProductCount();
    }

    // Sample orders
    const sampleOrders = [
      {
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 9876543210',
        customerEmail: 'rajesh.kumar@example.com',
        shippingAddress: {
          street: '123 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          landmark: 'Near City Mall'
        },
        items: [
          {
            productId: createdProducts[0]._id,
            name: createdProducts[0].name,
            price: createdProducts[0].priceNumeric,
            quantity: 1
          }
        ],
        totalAmount: createdProducts[0].priceNumeric,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'online',
        notes: 'Please deliver before 6 PM',
        actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        customerName: 'Priya Sharma',
        customerPhone: '+91 9876543211',
        customerEmail: 'priya.sharma@example.com',
        shippingAddress: {
          street: '456 Ring Road',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        items: [
          {
            productId: createdProducts[1]._id,
            name: createdProducts[1].name,
            price: createdProducts[1].priceNumeric,
            quantity: 2
          }
        ],
        totalAmount: createdProducts[1].priceNumeric * 2,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'upi',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
      },
      {
        customerName: 'Amit Patel',
        customerPhone: '+91 9876543212',
        shippingAddress: {
          street: '789 SG Highway',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001'
        },
        items: [
          {
            productId: createdProducts[2]._id,
            name: createdProducts[2].name,
            price: createdProducts[2].priceNumeric,
            quantity: 1
          },
          {
            productId: createdProducts[3]._id,
            name: createdProducts[3].name,
            price: createdProducts[3].priceNumeric,
            quantity: 1
          }
        ],
        totalAmount: createdProducts[2].priceNumeric + createdProducts[3].priceNumeric,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cod'
      }
    ];

    // Create orders
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`📦 Created ${createdOrders.length} orders`);

    // Sample reviews
    const sampleReviews = [
      {
        productId: createdProducts[0]._id,
        orderId: createdOrders[0]._id,
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 9876543210',
        rating: 5,
        title: 'Excellent Product!',
        comment: 'Amazing quality and fast delivery. Highly recommended!',
        isVerified: true,
        isVisible: true
      },
      {
        productId: createdProducts[1]._id,
        customerName: 'Priya Sharma',
        customerPhone: '+91 9876543211',
        rating: 4,
        title: 'Good quality',
        comment: 'Nice product but delivery was a bit delayed. Overall satisfied.',
        isVerified: true,
        isVisible: true,
        adminReply: 'Thank you for your feedback! We apologize for the delay and are working to improve our delivery times.',
        adminReplyDate: new Date()
      },
      {
        productId: createdProducts[0]._id,
        customerName: 'Neha Singh',
        customerPhone: '+91 9876543213',
        rating: 5,
        title: 'Love it!',
        comment: 'Perfect for my needs. Great build quality and design.',
        isVerified: false,
        isVisible: true
      },
      {
        productId: createdProducts[2]._id,
        customerName: 'Rohit Gupta',
        customerPhone: '+91 9876543214',
        rating: 3,
        title: 'Average product',
        comment: 'It\'s okay, nothing special. Expected better for the price.',
        isVerified: false,
        isVisible: false
      }
    ];

    // Create reviews
    const createdReviews = await Review.insertMany(sampleReviews);
    console.log(`⭐ Created ${createdReviews.length} reviews`);

    console.log('✅ Database initialization completed successfully');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

/**
 * Clean up database (remove all data)
 */
const cleanDatabase = async () => {
  try {
    console.log('🧹 Cleaning database...');

    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    console.log('✅ Database cleaned successfully');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    throw error;
  }
};

/**
 * Seed database with fresh data
 */
const seedDatabase = async () => {
  try {
    await cleanDatabase();
    await initializeDatabase();
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    throw error;
  }
};

/**
 * Update product counts for all categories
 */
const updateAllCategoryProductCounts = async () => {
  try {
    console.log('🔄 Updating category product counts...');

    const categories = await Category.find({ isActive: true });
    
    for (const category of categories) {
      await category.updateProductCount();
    }

    console.log(`✅ Updated product counts for ${categories.length} categories`);
  } catch (error) {
    console.error('❌ Failed to update category product counts:', error.message);
    throw error;
  }
};

/**
 * Generate slugs for existing data
 */
const generateSlugs = async () => {
  try {
    console.log('🔄 Generating slugs...');

    // Update products without slugs
    const productsWithoutSlugs = await Product.find({ slug: { $exists: false } });
    for (const product of productsWithoutSlugs) {
      await product.save(); // This will trigger the pre-save middleware to generate slug
    }

    // Update categories without slugs
    const categoriesWithoutSlugs = await Category.find({ slug: { $exists: false } });
    for (const category of categoriesWithoutSlugs) {
      await category.save(); // This will trigger the pre-save middleware to generate slug
    }

    console.log('✅ Slugs generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate slugs:', error.message);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  cleanDatabase,
  seedDatabase,
  updateAllCategoryProductCounts,
  generateSlugs
};
