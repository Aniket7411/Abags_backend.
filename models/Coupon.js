const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: [true, 'Please provide discount value']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Validate coupon
couponSchema.methods.isValid = function(cartTotal) {
  const now = new Date();
  
  if (!this.active) {
    return { valid: false, message: 'This coupon is not active' };
  }
  
  if (now < this.validFrom) {
    return { valid: false, message: 'This coupon is not yet valid' };
  }
  
  if (now > this.validTo) {
    return { valid: false, message: 'This coupon has expired' };
  }
  
  if (cartTotal < this.minPurchase) {
    return { valid: false, message: `Minimum purchase of ₹${this.minPurchase} required` };
  }
  
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, message: 'This coupon has reached its usage limit' };
  }
  
  return { valid: true, message: 'Coupon is valid' };
};

// Calculate discount
couponSchema.methods.calculateDiscount = function(cartTotal) {
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (cartTotal * this.discount) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.discount;
  }
  
  return Math.min(discount, cartTotal);
};

// Create indexes
couponSchema.index({ code: 1 });

module.exports = mongoose.model('Coupon', couponSchema);


