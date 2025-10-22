const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  bagType: {
    type: String,
    required: [true, 'Please specify bag type']
  },
  material: {
    type: String,
    required: [true, 'Please specify material']
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
    min: 1
  },
  dimensions: String,
  color: String,
  features: String,
  budget: String,
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  referenceImages: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'quoted', 'approved', 'in_production', 'completed', 'cancelled'],
    default: 'pending'
  },
  quote: {
    pricePerUnit: Number,
    totalPrice: Number,
    productionTime: String,
    validUntil: Date
  },
  adminNotes: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date
}, {
  timestamps: true
});

// Generate reference number before saving
customRequestSchema.pre('save', async function(next) {
  if (!this.referenceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('CustomRequest').countDocuments();
    this.referenceNumber = `CBR-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Create indexes
customRequestSchema.index({ referenceNumber: 1 });
customRequestSchema.index({ userId: 1 });

module.exports = mongoose.model('CustomRequest', customRequestSchema);




