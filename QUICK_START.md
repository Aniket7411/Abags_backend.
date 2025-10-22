# ⚡ KanBags Backend - Quick Start (3 Commands!)

## 🎯 Get Running in Under 2 Minutes

### Prerequisites Check ✓
- [x] Node.js installed? → `node --version`
- [x] MongoDB installed? → `mongosh` (should connect)
- [x] Packages installed? → Already done!

---

## 🚀 Three Commands to Start

### 1️⃣ Seed Database (First Time Only)
```bash
node seeder.js -i
```

**What this does:**
- Creates admin account (admin@kanbags.com / admin123)
- Creates test buyer (john@example.com / buyer123)
- Adds 6 sample products
- Adds 3 sample coupons
- Adds 3 sample advertisements

### 2️⃣ Start Server
```bash
npm run dev
```

**What you'll see:**
```
✅ MongoDB Connected: localhost
👤 Default admin account created
🚀 Server running in development mode on port 5000
📡 API available at: http://localhost:5000/api/v1
```

### 3️⃣ Test API (Open in Browser)
```
http://localhost:5000
```

**If you see JSON with success: true → YOU'RE GOOD TO GO! 🎉**

---

## 🧪 Quick Test

### Test 1: Login
Open test.http and run:
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@kanbags.com",
  "password": "admin123"
}
```

**Expected:** You get a token ✅

### Test 2: Get Products
```
GET http://localhost:5000/api/v1/products
```

**Expected:** You see 6 products ✅

### Test 3: Validate Coupon
```http
POST http://localhost:5000/api/v1/coupons/validate
Content-Type: application/json

{
  "code": "LAUNCH50",
  "cartTotal": 2500
}
```

**Expected:** Discount calculated ✅

---

## ✅ Success Indicators

| Check | What to Look For |
|-------|-----------------|
| 🟢 Server Running | Green text in terminal |
| 🟢 MongoDB Connected | "MongoDB Connected" message |
| 🟢 Admin Created | "Default admin account created" |
| 🟢 API Responding | Browser shows JSON at localhost:5000 |

---

## 🔥 Common Issues & Instant Fixes

### ❌ "Cannot connect to MongoDB"
**Fix:** Start MongoDB
```bash
# Windows: Search "Services" → MongoDB → Start
# Check: mongosh (should connect)
```

### ❌ "Port 5000 already in use"
**Fix:** Change port in `.env`
```env
PORT=8000
```

### ❌ "Error: Cannot find module"
**Fix:** Reinstall
```bash
rm -rf node_modules
npm install
```

---

## 📱 Connect to Frontend

In your React frontend, just change:

```javascript
// Before (dummy data)
const API_BASE_URL = 'dummy';

// After (real backend)
const API_BASE_URL = 'http://localhost:5000/api/v1';
```

That's it! All endpoints match the documentation.

---

## 🎯 What's Working Right Now

✅ **Authentication** - Login/Register/Token  
✅ **Products** - List/Filter/Search/CRUD  
✅ **Orders** - Place/Track/Cancel  
✅ **Coupons** - Validate/Apply  
✅ **Admin Panel** - Full management  
✅ **File Uploads** - Ready (needs Cloudinary)  
✅ **Emails** - Ready (needs Gmail config)

---

## 📚 Full Documentation

- **BACKEND_COMPLETION_SUMMARY.md** - Complete feature list
- **README.md** - Detailed documentation
- **SETUP_GUIDE.md** - Comprehensive setup guide
- **BACKEND_API.md** - Full API reference
- **test.http** - All API test cases

---

## 🎉 You're All Set!

The backend is **100% complete** and ready to use!

**Next:** Test the APIs and integrate with frontend.

---

Need help? Check SETUP_GUIDE.md for troubleshooting!

**Happy Coding! 🚀**




