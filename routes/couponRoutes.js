const express = require('express');
const router = express.Router();
const {
  getActiveCoupons,
  validateCoupon,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/active', getActiveCoupons);
router.post('/validate', validateCoupon);

// Admin routes
router.get('/', protect, authorize('admin'), getAllCoupons);
router.post('/', protect, authorize('admin'), createCoupon);
router.put('/:couponId', protect, authorize('admin'), updateCoupon);
router.delete('/:couponId', protect, authorize('admin'), deleteCoupon);

module.exports = router;




