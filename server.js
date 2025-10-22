const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const colors = require('colors');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const customRequestRoutes = require('./routes/customRequestRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Import DB connection
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KanBags API is running',
    version: process.env.API_VERSION || 'v1',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
const apiVersion = `/api/${process.env.API_VERSION || 'v1'}`;
app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/products`, productRoutes);
app.use(`${apiVersion}/orders`, orderRoutes);
app.use(`${apiVersion}/coupons`, couponRoutes);
app.use(`${apiVersion}/advertisements`, advertisementRoutes);
app.use(`${apiVersion}/inquiries`, inquiryRoutes);
app.use(`${apiVersion}/custom-requests`, customRequestRoutes);
app.use(`${apiVersion}/upload`, uploadRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  console.log(`📡 API available at: http://localhost:${PORT}${apiVersion}`.cyan);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});

module.exports = app;


