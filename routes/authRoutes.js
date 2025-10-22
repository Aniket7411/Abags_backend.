const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  verifyToken,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/verify', protect, verifyToken);

module.exports = router;




