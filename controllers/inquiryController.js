const Inquiry = require('../models/Inquiry');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Submit bulk inquiry
// @route   POST /api/v1/inquiries/bulk
// @access  Public
exports.submitBulkInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    // Send notification email to admin
    const inquiryEmail = emailTemplates.bulkInquiry(inquiry);
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@kanbags.com',
      ...inquiryEmail
    });

    // Send confirmation to user
    await sendEmail({
      to: inquiry.email,
      subject: 'Bulk Inquiry Received - KanBags',
      html: `
        <h1>Thank you for your inquiry!</h1>
        <p>Dear ${inquiry.name},</p>
        <p>We have received your bulk inquiry for ${inquiry.businessName}.</p>
        <p>Our team will review your requirements and get back to you within 24-48 hours.</p>
        <h3>Your Details:</h3>
        <p><strong>Business Type:</strong> ${inquiry.businessType}</p>
        <p><strong>Quantity:</strong> ${inquiry.quantity}</p>
        <p>Best regards,<br>Team KanBags</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Your inquiry has been submitted. We will contact you soon!',
      data: {
        inquiryId: inquiry._id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/v1/inquiries
// @access  Private/Admin
exports.getAllInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        inquiries,
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

// @desc    Get single inquiry (Admin)
// @route   GET /api/v1/inquiries/:inquiryId
// @access  Private/Admin
exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.inquiryId);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status (Admin)
// @route   PUT /api/v1/inquiries/:inquiryId
// @access  Private/Admin
exports.updateInquiry = async (req, res, next) => {
  try {
    let inquiry = await Inquiry.findById(req.params.inquiryId);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    inquiry = await Inquiry.findByIdAndUpdate(req.params.inquiryId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/v1/inquiries/:inquiryId
// @access  Private/Admin
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.inquiryId);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};




