# 🚀 KanBags Backend API Documentation v2.0

Complete API documentation for the KanBags e-commerce platform with all endpoints, request/response formats, and implementation guidelines.

---

## 📋 Table of Contents

- [Base Configuration](#base-configuration)
- [Authentication APIs](#authentication-apis)
- [Product APIs](#product-apis)
- [Order APIs](#order-apis)
- [Coupon APIs](#coupon-apis)
- [Advertisement APIs](#advertisement-apis)
- [Inquiry APIs](#inquiry-apis)
- [Custom Bag Request APIs](#custom-bag-request-apis)
- [File Upload APIs](#file-upload-apis)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Environment Setup](#environment-setup)

---

## Base Configuration

### Base URLs
```
Production: https://api.kanbags.com/v1
Development: http://localhost:5000/api/v1
```

### Authentication Header
```http
Authorization: Bearer <jwt_token>
```

### Standard Response Format
```json
{
  "success": true|false,
  "message": "Response message",
  "data": {},
  "errors": []
}
```

---

## 🔐 Authentication APIs

### 1. User Registration
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "9876543210"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "buyer"
    },
    "token": "jwt_token_here"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": ["Email validation failed"]
}
```

---

### 2. User Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 3. Forgot Password Request
**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### 4. Reset Password
**Endpoint:** `POST /auth/reset-password/:token`

**Request Body:**
```json
{
  "password": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 5. Verify Token
**Endpoint:** `GET /auth/verify`  
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    }
  }
}
```

---

## 📦 Product APIs

### 1. Get All Products (with filters)
**Endpoint:** `GET /products`

**Query Parameters:**
```
category      - Filter by category (optional)
material      - Filter by material (optional)
minPrice      - Minimum price (optional)
maxPrice      - Maximum price (optional)
search        - Search by name (optional)
sortBy        - price-low|price-high|rating (optional)
page          - Page number (default: 1)
limit         - Items per page (default: 20)
```

**Example:**
```http
GET /products?category=office&material=leather&minPrice=1000&maxPrice=5000&sortBy=price-low&page=1&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product_id",
        "name": "Executive Leather Briefcase",
        "category": "office",
        "material": "leather",
        "price": 3499,
        "originalPrice": 4999,
        "discount": 30,
        "description": "Premium genuine leather briefcase...",
        "image": "https://cdn.kanbags.com/products/briefcase.jpg",
        "images": [
          "https://cdn.kanbags.com/products/briefcase-1.jpg",
          "https://cdn.kanbags.com/products/briefcase-2.jpg"
        ],
        "stock": 25,
        "featured": true,
        "rating": 4.5,
        "reviews": 124,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

---

### 2. Get Single Product
**Endpoint:** `GET /products/:productId`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "product_id",
      "name": "Executive Leather Briefcase",
      "category": "office",
      "material": "leather",
      "price": 3499,
      "originalPrice": 4999,
      "discount": 30,
      "description": "Premium genuine leather briefcase...",
      "image": "https://cdn.kanbags.com/products/briefcase.jpg",
      "images": [
        "https://cdn.kanbags.com/products/briefcase-1.jpg",
        "https://cdn.kanbags.com/products/briefcase-2.jpg",
        "https://cdn.kanbags.com/products/briefcase-3.jpg"
      ],
      "stock": 25,
      "featured": true,
      "rating": 4.5,
      "reviews": 124,
      "specifications": {
        "dimensions": "40cm x 30cm x 10cm",
        "weight": "1.2kg",
        "compartments": 3,
        "laptopSize": "15.6 inches"
      }
    }
  }
}
```

---

### 3. Add Product (Admin Only)
**Endpoint:** `POST /products`  
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Leather Bag",
  "category": "office",
  "material": "leather",
  "price": 2999,
  "originalPrice": 3999,
  "description": "Product description...",
  "image": "https://cdn.kanbags.com/products/new-bag.jpg",
  "images": [
    "https://cdn.kanbags.com/products/new-bag-1.jpg",
    "https://cdn.kanbags.com/products/new-bag-2.jpg"
  ],
  "stock": 50,
  "featured": false,
  "specifications": {
    "dimensions": "40cm x 30cm x 10cm",
    "weight": "1.2kg"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product added successfully",
  "data": {
    "product": { /* full product object */ }
  }
}
```

---

### 4. Update Product (Admin Only)
**Endpoint:** `PUT /products/:productId`  
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** Same as Add Product

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": { /* updated product object */ }
  }
}
```

---

### 5. Delete Product (Admin Only)
**Endpoint:** `DELETE /products/:productId`  
**Headers:** `Authorization: Bearer <admin_token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 📋 Order APIs

### 1. Place Order
**Endpoint:** `POST /orders`  
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "products": [
    {
      "productId": "product_id",
      "quantity": 2,
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
  "total": 6998,
  "discount": 500,
  "shippingCost": 0,
  "finalTotal": 6498,
  "couponCode": "LAUNCH50",
  "paymentMethod": "cod"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "id": "order_id",
      "orderNumber": "ORD-2024-001234",
      "userId": "user_id",
      "products": [...],
      "shippingAddress": {...},
      "total": 6998,
      "discount": 500,
      "finalTotal": 6498,
      "status": "pending",
      "paymentMethod": "cod",
      "paymentStatus": "pending",
      "orderDate": "2024-10-21T15:30:00Z",
      "estimatedDelivery": "2024-10-28T00:00:00Z"
    }
  }
}
```

---

### 2. Get User Orders
**Endpoint:** `GET /orders/user/:userId`  
**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
status  - Filter by status (optional)
page    - Page number (default: 1)
limit   - Items per page (default: 10)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_id",
        "orderNumber": "ORD-2024-001234",
        "products": [...],
        "total": 6998,
        "finalTotal": 6498,
        "status": "delivered",
        "orderDate": "2024-09-15T10:00:00Z",
        "deliveryDate": "2024-09-20T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### 3. Get Single Order
**Endpoint:** `GET /orders/:orderId`  
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_id",
      "orderNumber": "ORD-2024-001234",
      "userId": "user_id",
      "products": [...],
      "shippingAddress": {...},
      "total": 6998,
      "discount": 500,
      "finalTotal": 6498,
      "status": "delivered",
      "paymentMethod": "cod",
      "paymentStatus": "completed",
      "orderDate": "2024-09-15T10:00:00Z",
      "deliveryDate": "2024-09-20T14:30:00Z",
      "trackingHistory": [
        {
          "status": "pending",
          "timestamp": "2024-09-15T10:00:00Z",
          "description": "Order placed"
        },
        {
          "status": "confirmed",
          "timestamp": "2024-09-15T12:00:00Z",
          "description": "Order confirmed"
        },
        {
          "status": "delivered",
          "timestamp": "2024-09-20T14:30:00Z",
          "description": "Order delivered"
        }
      ]
    }
  }
}
```

---

### 4. Cancel Order
**Endpoint:** `PUT /orders/:orderId/cancel`  
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "Changed my mind / Found better alternative / Incorrect order"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "order": {
      "id": "order_id",
      "status": "cancelled",
      "cancellationReason": "Changed my mind",
      "cancellationDate": "2024-10-21T16:00:00Z"
    }
  }
}
```

---

### 5. Update Order Status (Admin Only)
**Endpoint:** `PUT /orders/:orderId/status`  
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789",
  "notes": "Dispatched via courier"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "order": { /* updated order */ }
  }
}
```

---

### 6. Get All Orders (Admin Only)
**Endpoint:** `GET /orders`  
**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
```
status  - Filter by status (optional)
page    - Page number (default: 1)
limit   - Items per page (default: 20)
search  - Search by order number or customer name (optional)
```

---

## 🎟️ Coupon APIs

### 1. Get Active Coupons
**Endpoint:** `GET /coupons/active`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": "coupon_id",
        "code": "LAUNCH50",
        "discount": 50,
        "discountType": "percentage",
        "minPurchase": 1000,
        "maxDiscount": 500,
        "validFrom": "2024-01-01",
        "validTo": "2025-12-31",
        "description": "Launch offer - Get 50% off",
        "active": true
      }
    ]
  }
}
```

---

### 2. Validate Coupon
**Endpoint:** `POST /coupons/validate`

**Request Body:**
```json
{
  "code": "LAUNCH50",
  "cartTotal": 2500,
  "userId": "user_id"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "discount": 500,
    "finalTotal": 2000,
    "coupon": {
      "id": "coupon_id",
      "code": "LAUNCH50",
      "description": "Launch offer - Get 50% off"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Minimum purchase of ₹1000 required"
}
```

---

### 3. Create Coupon (Admin Only)
**Endpoint:** `POST /coupons`  
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "code": "SUMMER30",
  "discount": 30,
  "discountType": "percentage",
  "minPurchase": 1500,
  "maxDiscount": 1000,
  "validFrom": "2024-06-01",
  "validTo": "2024-08-31",
  "description": "Summer special offer",
  "usageLimit": 1000,
  "perUserLimit": 1,
  "active": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "coupon": { /* coupon object */ }
  }
}
```

---

## 📢 Advertisement APIs

### 1. Get Active Advertisements
**Endpoint:** `GET /advertisements/active`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "advertisements": [
      {
        "id": "ad_id",
        "title": "Premium Leather Collection",
        "description": "Handcrafted in Kanpur",
        "image": "https://cdn.kanbags.com/ads/leather-collection.jpg",
        "link": "/products?category=leather",
        "startDate": "2024-01-01",
        "endDate": "2025-12-31",
        "active": true,
        "order": 1
      }
    ]
  }
}
```

---

### 2. Manage Advertisements (Admin Only)
**Create:** `POST /advertisements`  
**Update:** `PUT /advertisements/:adId`  
**Delete:** `DELETE /advertisements/:adId`  
**Get All:** `GET /advertisements`

**Headers:** `Authorization: Bearer <admin_token>`

---

## 📝 Inquiry APIs

### 1. Submit Bulk Inquiry
**Endpoint:** `POST /inquiries/bulk`

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@business.com",
  "phone": "9876543210",
  "businessName": "Kumar Retail",
  "businessType": "retailer",
  "quantity": "100 pieces per month",
  "message": "Looking for wholesale rates for office bags"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your inquiry has been submitted. We will contact you soon!",
  "data": {
    "inquiryId": "inquiry_id",
    "referenceNumber": "INQ-2024-001234"
  }
}
```

---

## 🎨 Custom Bag Request APIs

### 1. Submit Custom Bag Request
**Endpoint:** `POST /custom-requests`

**Content-Type:** `multipart/form-data`

**Form Data:**
```
name              - Customer name (required)
email             - Email address (required)
phone             - Phone number (required)
bagType           - Type of bag (required)
material          - Material preference (required)
quantity          - Number of bags needed (required)
dimensions        - Approximate dimensions (optional)
color             - Color preference (optional)
features          - Special features (optional)
budget            - Budget range (optional)
description       - Detailed description (required)
referenceImages[] - Image files (max 5, each max 5MB)
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Your custom bag request has been submitted!",
  "data": {
    "requestId": "custom_request_id",
    "referenceNumber": "CBR-2024-001234",
    "estimatedResponse": "24-48 hours"
  }
}
```

---

### 2. Get Custom Request Status
**Endpoint:** `GET /custom-requests/:requestId`  
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "request": {
      "id": "request_id",
      "referenceNumber": "CBR-2024-001234",
      "status": "pending|under_review|quoted|approved|in_production|completed|cancelled",
      "submittedAt": "2024-10-21T10:00:00Z",
      "quote": {
        "pricePerUnit": 3500,
        "totalPrice": 7000,
        "productionTime": "15-20 days",
        "validUntil": "2024-11-21"
      },
      "referenceImages": [
        "https://cdn.kanbags.com/custom/image1.jpg"
      ]
    }
  }
}
```

---

### 3. Get User's Custom Requests
**Endpoint:** `GET /custom-requests/user/:userId`  
**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "request_id",
        "referenceNumber": "CBR-2024-001234",
        "bagType": "office",
        "status": "under_review",
        "submittedAt": "2024-10-21T10:00:00Z"
      }
    ]
  }
}
```

---

## 📸 File Upload APIs

### 1. Upload Product Images (Admin Only)
**Endpoint:** `POST /upload/product-images`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Content-Type:** `multipart/form-data`

**Form Data:**
```
images[] - Image files (max 5 files, each max 5MB)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "url": "https://cdn.kanbags.com/products/image1.jpg",
        "thumbnail": "https://cdn.kanbags.com/products/thumbnails/image1.jpg"
      }
    ]
  }
}
```

---

### 2. Upload Advertisement Images (Admin Only)
**Endpoint:** `POST /upload/ad-images`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Content-Type:** `multipart/form-data`

---

### 3. Upload Custom Request Images
**Endpoint:** `POST /upload/custom-request-images`  
**Content-Type:** `multipart/form-data`

---

## 📊 Data Models

### User Schema
```javascript
{
  id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String (required),
  role: String (enum: ['buyer', 'admin'], default: 'buyer'),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  emailVerified: Boolean (default: false),
  phoneVerified: Boolean (default: false),
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

### Product Schema
```javascript
{
  id: ObjectId,
  name: String (required),
  category: String (enum, required),
  material: String (enum, required),
  price: Number (required),
  originalPrice: Number (required),
  discount: Number (calculated),
  description: String (required),
  image: String (URL, required),
  images: [String] (URLs),
  stock: Number (required, default: 0),
  featured: Boolean (default: false),
  rating: Number (default: 0),
  reviews: Number (default: 0),
  specifications: {
    dimensions: String,
    weight: String,
    compartments: Number,
    laptopSize: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

### Order Schema
```javascript
{
  id: ObjectId,
  orderNumber: String (unique, auto-generated),
  userId: ObjectId (ref: User, required),
  products: [{
    productId: ObjectId (ref: Product),
    name: String,
    image: String,
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  total: Number (required),
  discount: Number (default: 0),
  shippingCost: Number (default: 0),
  finalTotal: Number (required),
  status: String (enum, default: 'pending'),
  paymentMethod: String (enum: ['cod', 'online']),
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  couponCode: String,
  trackingNumber: String,
  cancellationReason: String,
  cancellationDate: Date,
  orderDate: Date (required),
  deliveryDate: Date,
  estimatedDelivery: Date,
  trackingHistory: [{
    status: String,
    timestamp: Date,
    description: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

### Custom Bag Request Schema
```javascript
{
  id: ObjectId,
  referenceNumber: String (unique, auto-generated),
  userId: ObjectId (ref: User),
  name: String (required),
  email: String (required),
  phone: String (required),
  bagType: String (required),
  material: String (required),
  quantity: Number (required),
  dimensions: String,
  color: String,
  features: String,
  budget: String,
  description: String (required),
  referenceImages: [String] (URLs),
  status: String (enum, default: 'pending'),
  quote: {
    pricePerUnit: Number,
    totalPrice: Number,
    productionTime: String,
    validUntil: Date
  },
  adminNotes: String,
  submittedAt: Date (required),
  respondedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚠️ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Invalid/Missing Token)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found
- `409` - Conflict (Duplicate Entry)
- `500` - Internal Server Error

---

## 🔧 Environment Setup

### Required Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanbags

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# Email Service (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kanbags.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="KanBags <noreply@kanbags.com>"

# SMS Service (Optional - Twilio/MSG91)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=KANBGS

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_key
RAZORPAY_KEY_SECRET=rzp_test_secret

# Frontend URL (CORS)
FRONTEND_URL=https://kanbags.com
FRONTEND_URL_DEV=http://localhost:3000

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

---

## 🔒 Security Best Practices

1. **Password Hashing:** Use bcrypt with salt rounds >= 10
2. **JWT:** Include user ID and role, set appropriate expiration
3. **Rate Limiting:** Implement on all endpoints
4. **Input Validation:** Sanitize all user inputs
5. **CORS:** Configure proper origins
6. **HTTPS:** Use SSL certificates in production
7. **File Upload:** Validate file types and sizes
8. **SQL Injection:** Use parameterized queries
9. **XSS Protection:** Escape user-generated content
10. **CSRF Protection:** Use CSRF tokens for state-changing operations

---

## 📚 Additional Notes

### Database Indexes
Create indexes for:
- User: `email` (unique)
- Product: `category`, `material`, `price`, `featured`
- Order: `userId`, `orderNumber`, `status`, `orderDate`
- Coupon: `code` (unique)
- CustomRequest: `referenceNumber` (unique), `userId`

### Email Templates
Required email templates:
- Welcome email
- Password reset
- Order confirmation
- Order status update
- Custom request received
- Custom request quote

### Pagination Standard
```json
{
  "page": 1,
  "limit": 20,
  "total": 156,
  "pages": 8,
  "hasNext": true,
  "hasPrev": false
}
```

---

## 📞 Support

**Technical Documentation:** https://docs.kanbags.com  
**API Support:** dev@kanbags.com  
**Business Inquiries:** info@kanbags.com

---

**Version:** 2.0.0  
**Last Updated:** October 2024  
**Author:** KanBags Development Team

