const Coupon = require('../models/Coupon');

// @desc    Get active coupons
// @route   GET /api/v1/coupons/active
// @access  Public
exports.getActiveCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      active: true,
      validFrom: { $lte: now },
      validTo: { $gte: now }
    }).select('-usageCount');

    res.status(200).json({
      success: true,
      data: { coupons }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate coupon
// @route   POST /api/v1/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon is valid
    const validation = coupon.isValid(cartTotal);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(cartTotal);
    const finalTotal = cartTotal - discount;

    res.status(200).json({
      success: true,
      message: 'Coupon is valid',
      data: {
        discount,
        finalTotal,
        coupon: {
          id: coupon._id,
          code: coupon.code,
          description: coupon.description
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { coupon }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/v1/coupons
// @access  Private/Admin
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { coupons }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon
// @route   PUT /api/v1/coupons/:couponId
// @access  Private/Admin
exports.updateCoupon = async (req, res, next) => {
  try {
    let coupon = await Coupon.findById(req.params.couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    coupon = await Coupon.findByIdAndUpdate(req.params.couponId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: { coupon }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/v1/coupons/:couponId
// @access  Private/Admin
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};




