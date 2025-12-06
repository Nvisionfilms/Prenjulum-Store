# Penjulum Store - Quick Start Guide

## 🚀 Complete E-Commerce System

Your Penjulum store now has a full backend with:
- **Product Management** - Add, edit, and track inventory
- **Order Management** - Track all customer orders
- **PayPal Integration** - Secure checkout
- **Admin Dashboard** - Manage everything at `/admin`

## 📋 Setup Steps

### 1. Set Up Railway Database (5 minutes)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Provision PostgreSQL"
3. Click on the PostgreSQL service → "Connect" tab
4. Copy the `DATABASE_URL`

### 2. Configure Environment Variables

Create `.env.local` in your project root:

```env
# Railway PostgreSQL (paste your connection string)
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway

# PayPal (get from developer.paypal.com)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 3. Initialize Database

Run these commands:

```bash
# Install dependencies (if not already done)
npm install

# Push database schema to Railway
npx drizzle-kit push

# Start development server
npm run dev
```

### 4. Add Your First Product

Visit `http://localhost:3000/admin` and click "Add Product" or run this SQL in Railway:

```sql
INSERT INTO products (name, description, price, stock, sizes, colors, images, details, category)
VALUES (
  'Penjulum Classic',
  'Our signature black denim featuring embroidered knight and blossom artwork with premium stitching.',
  129.99,
  50,
  '["28", "30", "32", "34", "36", "38"]',
  '[{"name": "Black", "bgColor": "bg-black"}]',
  '["/products/Front Mock.png", "/products/Back Mock.png", "/products/front black.png", "/products/back black.jpg", "/products/left leg front.png", "/products/right leg front.png", "/products/pocket lgoo.png"]',
  '["98% Cotton, 2% Elastane", "Mid-rise slim fit", "Embroidered knight & blossom details", "Premium stitching throughout", "Signature Penjulum pocket branding", "Button closure with branded hardware", "Machine wash cold, hang dry"]',
  'denim'
);
```

## 🎯 Features

### Customer Experience
- **Homepage** (`/`) - Video hero, product grid, story section
- **Product Pages** (`/product/[id]`) - Image gallery, size/color selection
- **Shopping Cart** (`/cart`) - Quantity controls, checkout form
- **PayPal Checkout** - Secure payment processing

### Admin Dashboard (`/admin`)
- **Products Tab**
  - View all products
  - Update stock levels in real-time
  - Edit product details
  - Add new products

- **Orders Tab**
  - View all customer orders
  - Update order status (pending → processing → shipped → delivered)
  - See customer details and shipping info
  - Track order items

## 🌐 Deploy to Railway

### Deploy Your App

1. Push code to GitHub
2. In Railway: "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Next.js and deploys

### Add Environment Variables in Railway

1. Go to your project → "Variables"
2. Add:
   - `DATABASE_URL` (auto-linked from PostgreSQL)
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

### Run Database Migration

In Railway's project settings:
1. Go to "Settings" → "Deploy"
2. Add build command: `npm run build && npx drizzle-kit push`

## 📊 Database Structure

### Products
- Product info (name, description, price)
- Inventory tracking (stock count)
- Variants (sizes, colors)
- Images and details

### Orders
- Customer information
- Order items with quantities
- Payment tracking (PayPal order ID)
- Order status workflow
- Automatic inventory updates

## 🛠️ Common Tasks

### Add a New Product
1. Go to `/admin`
2. Click "Add Product"
3. Fill in details
4. Upload images to `/public/products/`
5. Save

### Update Inventory
1. Go to `/admin` → "Products" tab
2. Change stock number
3. Auto-saves on blur

### Manage Orders
1. Go to `/admin` → "Orders" tab
2. View order details
3. Update status dropdown
4. Auto-saves

### Test Checkout
1. Add items to cart
2. Click "Proceed to Checkout"
3. Fill in shipping info
4. Use PayPal sandbox for testing

## 💡 Tips

- **Free Tier**: Railway offers $5/month free credit (enough for small stores)
- **Stock Alerts**: Products show "Only X left!" when stock < 10
- **Free Shipping**: Automatic for orders over $100
- **Order Tracking**: All orders saved with PayPal transaction IDs

## 🆘 Troubleshooting

**Database connection error?**
- Check `DATABASE_URL` in `.env.local`
- Run `npx drizzle-kit push` to create tables

**Products not showing?**
- Add products via admin or SQL
- Check `is_active = true` in database

**PayPal not working?**
- Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
- Use sandbox credentials for testing

## 📱 URLs

- **Store**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Cart**: http://localhost:3000/cart

## Next Steps

1. ✅ Set up Railway database
2. ✅ Add environment variables
3. ✅ Run database migration
4. ✅ Add your products
5. ✅ Test checkout flow
6. 🚀 Deploy to production!

Your store is ready to sell! 🎉
