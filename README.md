# KanBags Backend API

Complete REST API for KanBags E-Commerce Platform - Premium Leather Bags from Kanpur.

## 🚀 Features

- **Authentication & Authorization** (JWT-based)
- **Product Management** (CRUD with filters, search, sorting)
- **Order Management** (Place orders, track status, cancel)
- **Coupon System** (Create, validate, apply discounts)
- **Advertisement Management** (Banner management)
- **Bulk Inquiry System** (Wholesale inquiries)
- **Custom Bag Requests** (Custom manufacturing requests)
- **File Upload** (Image upload to Cloudinary)
- **Email Notifications** (Nodemailer integration)
- **Error Handling** (Centralized error handling)
- **Security** (Helmet, XSS protection, Rate limiting)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd abagsbackend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Edit the `.env` file with your credentials:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/kanbags

# JWT Secret (Change this!)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

5. **Seed database with sample data** (Optional)
```bash
node seeder.js -i
```

6. **Start the server**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start at: **http://localhost:5000**

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/verify` | Verify JWT token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password/:token` | Reset password |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/products` | Get all products (with filters) | Public |
| GET | `/products/featured` | Get featured products | Public |
| GET | `/products/:id` | Get single product | Public |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/orders` | Place new order | Private |
| GET | `/orders/user/:userId` | Get user orders | Private |
| GET | `/orders/:orderId` | Get single order | Private |
| PUT | `/orders/:orderId/cancel` | Cancel order | Private |
| GET | `/orders` | Get all orders | Admin |
| PUT | `/orders/:orderId/status` | Update order status | Admin |

### Coupon Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/coupons/active` | Get active coupons | Public |
| POST | `/coupons/validate` | Validate coupon | Public |
| GET | `/coupons` | Get all coupons | Admin |
| POST | `/coupons` | Create coupon | Admin |
| PUT | `/coupons/:couponId` | Update coupon | Admin |
| DELETE | `/coupons/:couponId` | Delete coupon | Admin |

### Advertisement Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/advertisements/active` | Get active ads | Public |
| GET | `/advertisements` | Get all ads | Admin |
| POST | `/advertisements` | Create ad | Admin |
| PUT | `/advertisements/:adId` | Update ad | Admin |
| DELETE | `/advertisements/:adId` | Delete ad | Admin |

### Inquiry Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/inquiries/bulk` | Submit bulk inquiry | Public |
| GET | `/inquiries` | Get all inquiries | Admin |
| GET | `/inquiries/:inquiryId` | Get inquiry | Admin |
| PUT | `/inquiries/:inquiryId` | Update inquiry | Admin |
| DELETE | `/inquiries/:inquiryId` | Delete inquiry | Admin |

### Custom Request Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/custom-requests` | Submit custom request | Public |
| GET | `/custom-requests/user/:userId` | Get user requests | Private |
| GET | `/custom-requests/:requestId` | Get request | Private |
| GET | `/custom-requests` | Get all requests | Admin |
| PUT | `/custom-requests/:requestId` | Update request | Admin |
| DELETE | `/custom-requests/:requestId` | Delete request | Admin |

### Upload Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/upload/product-images` | Upload product images | Admin |
| POST | `/upload/ad-images` | Upload ad images | Admin |
| POST | `/upload/custom-request-images` | Upload custom images | Public |
| DELETE | `/upload/:publicId` | Delete image | Admin |

## 🔑 Default Admin Credentials

```
Email: admin@kanbags.com
Password: admin123
```

## 📝 Sample API Calls

### Register User
```bash
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Login
```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@kanbags.com",
  "password": "admin123"
}
```

### Get Products with Filters
```bash
GET http://localhost:5000/api/v1/products?category=office&material=leather&minPrice=1000&maxPrice=5000&sortBy=price-low
```

### Create Order
```bash
POST http://localhost:5000/api/v1/orders
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "products": [
    {
      "productId": "product_id_here",
      "name": "Executive Briefcase",
      "image": "image-url",
      "quantity": 1,
      "price": 3499
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 Main Street",
    "city": "Kanpur",
    "state": "Uttar Pradesh",
    "pincode": "208001"
  },
  "total": 3499,
  "discount": 0,
  "shippingCost": 0,
  "finalTotal": 3499,
  "paymentMethod": "cod"
}
```

## 📁 Project Structure

```
abagsbackend/
├── config/
│   ├── db.js                    # Database connection
│   └── cloudinary.js            # Cloudinary config
├── controllers/
│   ├── authController.js        # Auth logic
│   ├── productController.js     # Product logic
│   ├── orderController.js       # Order logic
│   ├── couponController.js      # Coupon logic
│   ├── advertisementController.js
│   ├── inquiryController.js
│   ├── customRequestController.js
│   └── uploadController.js
├── middleware/
│   ├── auth.js                  # JWT authentication
│   ├── errorHandler.js          # Error handling
│   └── upload.js                # File upload (multer)
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Coupon.js
│   ├── Advertisement.js
│   ├── Inquiry.js
│   └── CustomRequest.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── couponRoutes.js
│   ├── advertisementRoutes.js
│   ├── inquiryRoutes.js
│   ├── customRequestRoutes.js
│   └── uploadRoutes.js
├── utils/
│   ├── generateToken.js         # JWT token generator
│   └── emailService.js          # Email service
├── .env                         # Environment variables
├── .gitignore
├── server.js                    # Entry point
├── seeder.js                    # Database seeder
├── package.json
└── README.md
```

## 🛠️ Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Image storage
- **Multer** - File upload
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Helmet security headers
- XSS protection
- MongoDB sanitization
- CORS configuration
- Input validation
- Error handling

## 📊 Database Seeder

Import sample data:
```bash
node seeder.js -i
```

Delete all data:
```bash
node seeder.js -d
```

## 🚨 Error Handling

All errors return in this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## 📧 Email Templates

The API sends emails for:
- Welcome email on registration
- Order confirmation
- Order status updates
- Password reset
- Bulk inquiry confirmation
- Custom request confirmation
- Custom request quote

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Social media integration
- [ ] Real-time notifications (Socket.io)

## 📞 Support

For issues or questions:
- Email: dev@kanbags.com
- Documentation: Check BACKEND_API.md

## 📄 License

Proprietary - All rights reserved by KanBags

---

**Version:** 1.0.0  
**Author:** KanBags Development Team  
**Date:** October 2024




