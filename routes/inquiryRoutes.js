const express = require('express');
const router = express.Router();
const {
  submitBulkInquiry,
  getAllInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/bulk', submitBulkInquiry);

// Admin routes
router.get('/', protect, authorize('admin'), getAllInquiries);
router.get('/:inquiryId', protect, authorize('admin'), getInquiry);
router.put('/:inquiryId', protect, authorize('admin'), updateInquiry);
router.delete('/:inquiryId', protect, authorize('admin'), deleteInquiry);

module.exports = router;




