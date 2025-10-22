const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.post('/', protect, createOrder);
router.get('/user/:userId', protect, getUserOrders);
router.get('/:orderId', protect, getOrder);
router.put('/:orderId/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:orderId/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;




