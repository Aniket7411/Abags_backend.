# KanBags Backend - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install MongoDB

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will start automatically

**Check if MongoDB is running:**
```bash
mongosh
# If connected, MongoDB is running!
```

### Step 2: Configure Environment

The `.env` file is already created. Update these important values:

1. **Database** (already set for local MongoDB):
```env
MONGODB_URI=mongodb://localhost:27017/kanbags
```

2. **JWT Secret** (already set, but you can change it):
```env
JWT_SECRET=kanbags-super-secret-jwt-key-min-32-characters-long-for-security-2024
```

3. **Email Configuration** (Optional - for testing without email, it will just log errors):
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

📧 **To get Gmail App Password:**
- Go to Google Account Settings → Security
- Enable 2-Step Verification
- Generate App Password
- Use that password in EMAIL_PASSWORD

4. **Cloudinary** (Optional - for image uploads):
- Sign up at: https://cloudinary.com (free account)
- Get your credentials from dashboard
- Update in `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Seed Database with Sample Data

```bash
node seeder.js -i
```

This will create:
- ✅ Admin account (admin@kanbags.com / admin123)
- ✅ Test buyer account (john@example.com / buyer123)
- ✅ 6 sample products
- ✅ 3 sample coupons
- ✅ 3 sample advertisements

### Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
👤 Default admin account created (or already exists)
🚀 Server running in development mode on port 5000
📡 API available at: http://localhost:5000/api/v1
```

### Step 6: Test the API

Open your browser or Postman:

**Health Check:**
```
GET http://localhost:5000
```

**Login:**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@kanbags.com",
  "password": "admin123"
}
```

**Get Products:**
```
GET http://localhost:5000/api/v1/products
```

## 🎯 Next Steps

### Connect Frontend

Update your frontend API service to point to:
```javascript
const API_BASE_URL = 'http://localhost:5000/api/v1';
```

### Test All Features

1. **Authentication**: Login with admin account
2. **Products**: Browse, filter, search products
3. **Orders**: Place test orders
4. **Coupons**: Validate coupon codes
5. **Admin Panel**: Manage products, orders, coupons

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not running, start MongoDB:
# Windows: Search "Services" → Find "MongoDB" → Start
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: "Port 5000 already in use"

**Solution:**
Change port in `.env`:
```env
PORT=8000
```

### Issue: "Email sending failed"

**Solution:**
Email is optional for testing. The API will work fine and just log email errors. To fix:
1. Update EMAIL_USER and EMAIL_PASSWORD in `.env`
2. Use Gmail App Password (not your regular password)

### Issue: "Image upload not working"

**Solution:**
Cloudinary is optional. Without it:
1. Use direct image URLs in product creation
2. Or set up Cloudinary account (free) and update `.env`

## 📊 Database Commands

**View all products:**
```bash
mongosh
use kanbags
db.products.find().pretty()
```

**View all users:**
```bash
db.users.find().pretty()
```

**Clear all data:**
```bash
node seeder.js -d
```

**Reimport data:**
```bash
node seeder.js -i
```

## 🔐 API Testing Tools

### Option 1: Postman
1. Download: https://www.postman.com/downloads/
2. Import API collection (you can create one from BACKEND_API.md)
3. Set base URL: http://localhost:5000/api/v1

### Option 2: VS Code REST Client
1. Install "REST Client" extension
2. Create `test.http` file
3. Write requests:
```http
### Login
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@kanbags.com",
  "password": "admin123"
}

### Get Products
GET http://localhost:5000/api/v1/products
```

### Option 3: Browser (for GET requests)
```
http://localhost:5000/api/v1/products
http://localhost:5000/api/v1/coupons/active
http://localhost:5000/api/v1/advertisements/active
```

## 📱 Frontend Integration

In your React frontend, update the API service:

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  }
};

// Product Service
export const productService = {
  getProducts: async (filters) => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};

// Add more services as needed...
```

## 🎉 Success Checklist

- ✅ MongoDB installed and running
- ✅ Dependencies installed (`npm install`)
- ✅ Sample data seeded (`node seeder.js -i`)
- ✅ Server running (`npm run dev`)
- ✅ API responding (test with browser or Postman)
- ✅ Can login with admin credentials
- ✅ Can fetch products

## 🆘 Need Help?

If you encounter any issues:

1. **Check logs in terminal** - Most errors are clearly described
2. **Verify MongoDB is running** - `mongosh` should connect
3. **Check .env file** - Ensure all required variables are set
4. **Try deleting node_modules** - Then `npm install` again
5. **Check port 5000** - Make sure nothing else is using it

## 📞 Support

- Check: BACKEND_API.md for complete API documentation
- Check: README.md for project overview
- Email: dev@kanbags.com

---

**Happy Coding! 🚀**




