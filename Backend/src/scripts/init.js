require('dotenv').config();
const connectDB = require('./config/database');
const Admin = require('./models/Admin');
const { initializeDatabase } = require('./utils/seedData');

const initializeApp = async () => {
  try {
    console.log('🚀 Starting application initialization...');

    // Connect to database
    await connectDB();

    // Create default admin user
    await Admin.createDefaultAdmin();

    // Initialize database with sample data
    await initializeDatabase();

    console.log('✅ Application initialization completed successfully');
    console.log('🔐 Default admin credentials:');
    console.log(`   Username: ${process.env.ADMIN_DEFAULT_USERNAME || 'admin'}`);
    console.log(`   Password: ${process.env.ADMIN_DEFAULT_PASSWORD || 'admin123'}`);
    console.log('');
    console.log('🌐 API endpoints available at:');
    console.log(`   Health: http://localhost:${process.env.PORT || 5000}/api/health`);
    console.log(`   Login: POST http://localhost:${process.env.PORT || 5000}/api/auth/login`);
    console.log(`   Products: http://localhost:${process.env.PORT || 5000}/api/products`);
    console.log(`   Categories: http://localhost:${process.env.PORT || 5000}/api/categories`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Application initialization failed:', error.message);
    process.exit(1);
  }
};

initializeApp();
