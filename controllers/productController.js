const Product = require('../models/Product');

// @desc    Get all products with filters
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, material, minPrice, maxPrice, search, sortBy, page = 1, limit = 20 } = req.query;

    // Build query
    let query = {};

    if (category) query.category = category;
    if (material) query.material = material;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    let sort = {};
    if (sortBy === 'price-low') sort.price = 1;
    else if (sortBy === 'price-high') sort.price = -1;
    else if (sortBy === 'rating') sort.rating = -1;
    else sort.createdAt = -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);

    res.status(200).json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};




