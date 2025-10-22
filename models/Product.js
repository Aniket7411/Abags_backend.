const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['office', 'ladies', 'sling', 'backpack', 'laptop', 'travel']
    },
    material: {
        type: String,
        required: [true, 'Please provide material type'],
        enum: ['leather', 'rexin', 'mixed']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price']
    },
    originalPrice: {
        type: Number,
        required: [true, 'Please provide original price']
    },
    discount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    image: {
        type: String,
        required: [true, 'Please provide a main image']
    },
    images: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    specifications: {
        dimensions: String,
        weight: String,
        compartments: Number,
        laptopSize: String
    }
}, {
    timestamps: true
});

// Calculate discount percentage before saving
productSchema.pre('save', function (next) {
    if (this.originalPrice && this.price) {
        this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    next();
});

// Create indexes
productSchema.index({ category: 1 });
productSchema.index({ material: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);

