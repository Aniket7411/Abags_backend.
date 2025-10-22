const express = require('express');
const router = express.Router();
const {
  uploadProductImages,
  uploadAdImages,
  uploadCustomRequestImages,
  deleteImage
} = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Admin routes
router.post('/product-images', protect, authorize('admin'), upload.array('images', 5), uploadProductImages);
router.post('/ad-images', protect, authorize('admin'), upload.array('images', 5), uploadAdImages);
router.delete('/:publicId', protect, authorize('admin'), deleteImage);

// Public route (for custom requests)
router.post('/custom-request-images', upload.array('images', 5), uploadCustomRequestImages);

module.exports = router;




