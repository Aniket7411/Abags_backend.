const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const Advertisement = require('./models/Advertisement');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@kanbags.com',
    password: 'admin123',
    phone: '9999999999',
    role: 'admin',
    emailVerified: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'buyer123',
    phone: '9876543210',
    role: 'buyer',
    emailVerified: true
  }
];

const products = [
  {
    name: 'Executive Leather Briefcase',
    category: 'office',
    material: 'leather',
    price: 3499,
    originalPrice: 4999,
    description: 'Premium genuine leather briefcase perfect for professionals. Features multiple compartments and laptop sleeve.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa'
    ],
    stock: 25,
    featured: true,
    rating: 4.5,
    reviews: 124,
    specifications: {
      dimensions: '40cm x 30cm x 10cm',
      weight: '1.2kg',
      compartments: 3,
      laptopSize: '15.6 inches'
    }
  },
  {
    name: 'Classic Office Bag',
    category: 'office',
    material: 'leather',
    price: 2499,
    originalPrice: 3499,
    description: 'Stylish office bag with elegant design. Perfect for daily office use.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7'],
    stock: 30,
    featured: false,
    rating: 4.3,
    reviews: 89
  },
  {
    name: 'Elegant Ladies Handbag',
    category: 'ladies',
    material: 'leather',
    price: 1999,
    originalPrice: 2999,
    description: 'Beautiful leather handbag for ladies. Spacious and stylish.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3'],
    stock: 40,
    featured: true,
    rating: 4.7,
    reviews: 156
  },
  {
    name: "Men's Leather Sling Bag",
    category: 'sling',
    material: 'leather',
    price: 1299,
    originalPrice: 1799,
    description: 'Compact sling bag for men. Perfect for casual outings.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62'],
    stock: 50,
    featured: false,
    rating: 4.4,
    reviews: 78
  },
  {
    name: 'Premium Laptop Backpack',
    category: 'laptop',
    material: 'leather',
    price: 2999,
    originalPrice: 3999,
    description: 'Durable laptop backpack with anti-theft features. Fits up to 17-inch laptops.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62'],
    stock: 35,
    featured: true,
    rating: 4.6,
    reviews: 203
  },
  {
    name: 'Travel Duffel Bag',
    category: 'travel',
    material: 'mixed',
    price: 3999,
    originalPrice: 5499,
    description: 'Spacious travel duffel bag for weekend trips. Water-resistant material.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62'],
    stock: 20,
    featured: false,
    rating: 4.5,
    reviews: 92
  }
];

const coupons = [
  {
    code: 'LAUNCH50',
    discount: 50,
    discountType: 'percentage',
    minPurchase: 1000,
    maxDiscount: 500,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2025-12-31'),
    description: 'Launch offer - Get 50% off on orders above ₹1000',
    usageLimit: 1000,
    perUserLimit: 1,
    active: true
  },
  {
    code: 'LEATHER20',
    discount: 20,
    discountType: 'percentage',
    minPurchase: 2000,
    maxDiscount: 1000,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2025-12-31'),
    description: 'Get 20% off on leather products',
    usageLimit: 500,
    perUserLimit: 2,
    active: true
  },
  {
    code: 'FLAT300',
    discount: 300,
    discountType: 'fixed',
    minPurchase: 1500,
    maxDiscount: 300,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2025-12-31'),
    description: 'Flat ₹300 off on orders above ₹1500',
    usageLimit: 2000,
    perUserLimit: 1,
    active: true
  }
];

const advertisements = [
  {
    title: 'Premium Leather Collection',
    description: 'Handcrafted in Kanpur - India\'s Leather Hub',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    link: '/products?category=leather',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    active: true,
    order: 1
  },
  {
    title: 'Special Offer - 50% Off',
    description: 'Limited time offer on selected items',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
    link: '/products?sortBy=discount',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    active: true,
    order: 2
  },
  {
    title: 'New Office Collection',
    description: 'Professional bags for modern workplace',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    link: '/products?category=office',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    active: true,
    order: 3
  }
];

// Import data
const importData = async () => {
  try {
    // Hash passwords for users
    const salt = await bcrypt.genSalt(10);
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, salt)
      }))
    );

    await User.create(hashedUsers);
    await Product.create(products);
    await Coupon.create(coupons);
    await Advertisement.create(advertisements);

    console.log('✅ Data imported successfully'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Advertisement.deleteMany();

    console.log('✅ Data deleted successfully'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse);
    process.exit(1);
  }
};

// Run
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use: node seeder.js -i (import) or -d (delete)');
  process.exit();
}




