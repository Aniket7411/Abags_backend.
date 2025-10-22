const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      products,
      shippingAddress,
      total,
      discount,
      shippingCost,
      finalTotal,
      couponCode,
      paymentMethod
    } = req.body;

    // Verify stock availability
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      products,
      shippingAddress,
      total,
      discount,
      shippingCost,
      finalTotal,
      couponCode,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
    });

    // Update product stock
    for (let item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Populate order
    await order.populate('userId', 'name email');

    // Send confirmation email
    const confirmEmail = emailTemplates.orderConfirmation(order);
    await sendEmail({
      to: req.user.email,
      ...confirmEmail
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/v1/orders/user/:userId
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Check authorization
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these orders'
      });
    }

    let query = { userId: req.params.userId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
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

// @desc    Get single order
// @route   GET /api/v1/orders/:orderId
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:orderId/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    // Update order
    order.status = 'cancelled';
    order.cancellationReason = req.body.reason || 'Cancelled by user';
    order.cancellationDate = new Date();
    await order.save();

    // Restore product stock
    for (let item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:orderId/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    const order = await Order.findById(req.params.orderId).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveryDate = new Date();
    
    await order.save();

    // Send status update email
    const statusEmail = emailTemplates.orderStatusUpdate(order);
    await sendEmail({
      to: order.userId.email,
      ...statusEmail
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ orderDate: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
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




