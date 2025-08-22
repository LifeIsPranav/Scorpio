const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are now defaults in Mongoose 6+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);

    // Create indexes for better performance
    await createIndexes();

  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Import models to trigger index creation
    require('../models/Product');
    require('../models/Category');
    require('../models/Admin');
    
    console.log('📋 Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error.message);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database connection:', error.message);
    process.exit(1);
  }
});

module.exports = connectDB;
