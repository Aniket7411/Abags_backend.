const express = require('express');
const router = express.Router();
const {
  getActiveAdvertisements,
  getAllAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  trackClick
} = require('../controllers/advertisementController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/active', getActiveAdvertisements);
router.post('/:adId/click', trackClick);

// Admin routes
router.get('/', protect, authorize('admin'), getAllAdvertisements);
router.post('/', protect, authorize('admin'), createAdvertisement);
router.put('/:adId', protect, authorize('admin'), updateAdvertisement);
router.delete('/:adId', protect, authorize('admin'), deleteAdvertisement);

module.exports = router;




