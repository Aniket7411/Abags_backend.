const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    image: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  total: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  finalTotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  couponCode: String,
  trackingNumber: String,
  cancellationReason: String,
  cancellationDate: Date,
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: Date,
  estimatedDelivery: Date,
  trackingHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: String
  }]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  
  // Set estimated delivery (7 days from order date)
  if (!this.estimatedDelivery) {
    const deliveryDate = new Date(this.orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    this.estimatedDelivery = deliveryDate;
  }
  
  // Add to tracking history
  if (this.isModified('status')) {
    this.trackingHistory.push({
      status: this.status,
      timestamp: new Date(),
      description: this.getStatusDescription(this.status)
    });
  }
  
  next();
});

// Get status description
orderSchema.methods.getStatusDescription = function(status) {
  const descriptions = {
    pending: 'Order placed and awaiting confirmation',
    confirmed: 'Order confirmed',
    processing: 'Order is being prepared',
    shipped: 'Order has been shipped',
    delivered: 'Order delivered successfully',
    cancelled: 'Order cancelled'
  };
  return descriptions[status] || 'Status updated';
};

// Create indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);


