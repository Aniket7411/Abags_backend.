const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  businessName: {
    type: String,
    required: [true, 'Please provide your business name']
  },
  businessType: {
    type: String,
    required: [true, 'Please provide your business type'],
    enum: ['retailer', 'wholesaler', 'distributor', 'online_seller', 'other']
  },
  quantity: {
    type: String,
    required: [true, 'Please provide quantity requirements']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'completed', 'cancelled'],
    default: 'new'
  },
  adminNotes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);




