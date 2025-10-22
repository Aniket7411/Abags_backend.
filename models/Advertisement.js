const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  link: {
    type: String,
    required: [true, 'Please provide a link']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Check if ad is currently valid
advertisementSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.active && now >= this.startDate && now <= this.endDate;
};

module.exports = mongoose.model('Advertisement', advertisementSchema);


