const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    
    // Create default admin user
    const User = require('../models/User');
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@kanbags.com' });
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
      
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@kanbags.com',
        password: hashedPassword,
        phone: '9999999999',
        role: 'admin',
        emailVerified: true
      });
      
      console.log('👤 Default admin account created'.green.bold);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;


