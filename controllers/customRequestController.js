const CustomRequest = require('../models/CustomRequest');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Submit custom bag request
// @route   POST /api/v1/custom-requests
// @access  Public
exports.submitCustomRequest = async (req, res, next) => {
  try {
    const requestData = {
      ...req.body,
      userId: req.user ? req.user._id : undefined
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      requestData.referenceImages = req.files.map(file => file.path);
    }

    const customRequest = await CustomRequest.create(requestData);

    // Send confirmation email to customer
    const confirmEmail = emailTemplates.customRequestReceived(customRequest);
    await sendEmail({
      to: customRequest.email,
      ...confirmEmail
    });

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@kanbags.com',
      subject: `New Custom Bag Request - ${customRequest.referenceNumber}`,
      html: `
        <h1>New Custom Bag Request</h1>
        <p><strong>Reference:</strong> ${customRequest.referenceNumber}</p>
        <p><strong>Customer:</strong> ${customRequest.name}</p>
        <p><strong>Email:</strong> ${customRequest.email}</p>
        <p><strong>Phone:</strong> ${customRequest.phone}</p>
        <p><strong>Bag Type:</strong> ${customRequest.bagType}</p>
        <p><strong>Material:</strong> ${customRequest.material}</p>
        <p><strong>Quantity:</strong> ${customRequest.quantity}</p>
        <p><strong>Budget:</strong> ${customRequest.budget || 'Not specified'}</p>
        <p><strong>Description:</strong> ${customRequest.description}</p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Your custom bag request has been submitted!',
      data: {
        requestId: customRequest._id,
        referenceNumber: customRequest.referenceNumber,
        estimatedResponse: '24-48 hours'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get custom request status
// @route   GET /api/v1/custom-requests/:requestId
// @access  Private
exports.getCustomRequest = async (req, res, next) => {
  try {
    const request = await CustomRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom request not found'
      });
    }

    // Check authorization
    if (request.userId && request.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request'
      });
    }

    res.status(200).json({
      success: true,
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's custom requests
// @route   GET /api/v1/custom-requests/user/:userId
// @access  Private
exports.getUserCustomRequests = async (req, res, next) => {
  try {
    // Check authorization
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these requests'
      });
    }

    const requests = await CustomRequest.find({ userId: req.params.userId })
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      data: { requests }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all custom requests (Admin)
// @route   GET /api/v1/custom-requests
// @access  Private/Admin
exports.getAllCustomRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const requests = await CustomRequest.find(query)
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await CustomRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
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

// @desc    Update custom request (Admin)
// @route   PUT /api/v1/custom-requests/:requestId
// @access  Private/Admin
exports.updateCustomRequest = async (req, res, next) => {
  try {
    let request = await CustomRequest.findById(req.params.requestId).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom request not found'
      });
    }

    const oldStatus = request.status;
    request = await CustomRequest.findByIdAndUpdate(req.params.requestId, req.body, {
      new: true,
      runValidators: true
    }).populate('userId', 'name email');

    // If status changed to 'quoted', send email to customer
    if (oldStatus !== 'quoted' && request.status === 'quoted' && request.quote) {
      await sendEmail({
        to: request.email,
        subject: `Quote Ready - ${request.referenceNumber}`,
        html: `
          <h1>Your Custom Bag Quote is Ready!</h1>
          <p>Dear ${request.name},</p>
          <p>We have prepared a quote for your custom bag request (${request.referenceNumber}).</p>
          <h3>Quote Details:</h3>
          <p><strong>Price per Unit:</strong> ₹${request.quote.pricePerUnit}</p>
          <p><strong>Total Price:</strong> ₹${request.quote.totalPrice}</p>
          <p><strong>Production Time:</strong> ${request.quote.productionTime}</p>
          <p><strong>Quote Valid Until:</strong> ${new Date(request.quote.validUntil).toLocaleDateString()}</p>
          <p>Please log in to your account to review and approve the quote.</p>
          <p>Best regards,<br>Team KanBags</p>
        `
      });
    }

    res.status(200).json({
      success: true,
      message: 'Custom request updated successfully',
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom request (Admin)
// @route   DELETE /api/v1/custom-requests/:requestId
// @access  Private/Admin
exports.deleteCustomRequest = async (req, res, next) => {
  try {
    const request = await CustomRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom request not found'
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Custom request deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};




