const express = require('express');
const router = express.Router();
const {
  submitCustomRequest,
  getCustomRequest,
  getUserCustomRequests,
  getAllCustomRequests,
  updateCustomRequest,
  deleteCustomRequest
} = require('../controllers/customRequestController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public/Optional Auth routes
router.post('/', optionalAuth, upload.array('referenceImages', 5), submitCustomRequest);

// Protected routes
router.get('/user/:userId', protect, getUserCustomRequests);
router.get('/:requestId', protect, getCustomRequest);

// Admin routes
router.get('/', protect, authorize('admin'), getAllCustomRequests);
router.put('/:requestId', protect, authorize('admin'), updateCustomRequest);
router.delete('/:requestId', protect, authorize('admin'), deleteCustomRequest);

module.exports = router;




