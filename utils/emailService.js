const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'KanBags <noreply@kanbags.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to KanBags!',
    html: `
      <h1>Welcome to KanBags, ${name}!</h1>
      <p>Thank you for registering with us. We're excited to have you on board.</p>
      <p>Explore our premium collection of leather bags crafted in Kanpur, the leather hub of India.</p>
      <p>Happy Shopping!</p>
      <p>Best regards,<br>Team KanBags</p>
    `
  }),

  orderConfirmation: (order) => ({
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Thank you for your order.</p>
      <h3>Order Details:</h3>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Total Amount:</strong> ₹${order.finalTotal}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
      <p>You can track your order status in your account.</p>
      <p>Best regards,<br>Team KanBags</p>
    `
  }),

  orderStatusUpdate: (order) => ({
    subject: `Order ${order.status.charAt(0).toUpperCase() + order.status.slice(1)} - ${order.orderNumber}`,
    html: `
      <h1>Order Status Updated</h1>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>New Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
      ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
      <p>Track your order in your account for more details.</p>
      <p>Best regards,<br>Team KanBags</p>
    `
  }),

  bulkInquiry: (inquiry) => ({
    subject: 'Bulk Inquiry Received',
    html: `
      <h1>New Bulk Inquiry</h1>
      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>Business:</strong> ${inquiry.businessName}</p>
      <p><strong>Type:</strong> ${inquiry.businessType}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Phone:</strong> ${inquiry.phone}</p>
      <p><strong>Quantity:</strong> ${inquiry.quantity}</p>
      <p><strong>Message:</strong> ${inquiry.message}</p>
    `
  }),

  customRequestReceived: (request) => ({
    subject: `Custom Bag Request Received - ${request.referenceNumber}`,
    html: `
      <h1>Custom Bag Request Received</h1>
      <p>Dear ${request.name},</p>
      <p>We have received your custom bag request with reference number: <strong>${request.referenceNumber}</strong></p>
      <p>Our team will review your requirements and get back to you within 24-48 hours with a quote.</p>
      <h3>Your Requirements:</h3>
      <p><strong>Bag Type:</strong> ${request.bagType}</p>
      <p><strong>Material:</strong> ${request.material}</p>
      <p><strong>Quantity:</strong> ${request.quantity}</p>
      <p><strong>Budget:</strong> ${request.budget || 'Not specified'}</p>
      <p>Best regards,<br>Team KanBags</p>
    `
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,<br>Team KanBags</p>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};




