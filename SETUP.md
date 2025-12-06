# Penjulum Store - Setup Guide

## Backend Setup with Railway

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Create PostgreSQL Database
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Copy the `DATABASE_URL` from the "Connect" tab

### 3. Environment Variables
Create a `.env.local` file in the project root:

```env
# Database (from Railway)
DATABASE_URL=postgresql://postgres:...@...railway.app:5432/railway

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

### 4. Initialize Database
Run the migration to create tables:

```bash
npm install
npx drizzle-kit push
```

This will create the `products` and `orders` tables in your Railway database.

### 5. Seed Initial Product (Optional)
The database will be empty initially. You can add your first product through the admin dashboard at `/admin` or manually insert:

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

### 6. Run Development Server
```bash
npm run dev
```

Visit:
- **Storefront**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## Features

### Customer Features
- Browse products with video hero
- View product details with image gallery
- Add to cart with size/color selection
- Checkout with PayPal
- Order confirmation

### Admin Features (`/admin`)
- **Product Management**
  - View all products
  - Update inventory/stock levels
  - Add new products
  - Edit existing products
  
- **Order Management**
  - View all orders
  - Update order status (pending → processing → shipped → delivered)
  - View customer details
  - Track order items

## Deployment to Railway

### Deploy the App
1. Push your code to GitHub
2. In Railway, click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Next.js and deploy

### Add Environment Variables in Railway
1. Go to your project → Variables
2. Add:
   - `DATABASE_URL` (already set from PostgreSQL service)
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

### Connect Database
Railway will automatically link your PostgreSQL database to your app.

## Database Schema

### Products Table
- `id`: UUID (primary key)
- `name`: Product name
- `description`: Product description
- `price`: Decimal price
- `stock`: Integer inventory count
- `sizes`: JSON array of available sizes
- `colors`: JSON array of color options
- `images`: JSON array of image URLs
- `details`: JSON array of product details
- `category`: Product category
- `is_active`: Boolean (show/hide product)
- `created_at`, `updated_at`: Timestamps

### Orders Table
- `id`: UUID (primary key)
- `customer_*`: Customer information fields
- `items`: JSON array of order items
- `subtotal`, `shipping`, `total`: Decimal amounts
- `status`: Order status enum
- `paypal_order_id`: PayPal transaction ID
- `created_at`, `updated_at`: Timestamps

## API Endpoints

### Products
- `GET /api/products` - List all active products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - List all orders (admin)
- `POST /api/orders` - Create new order
- `PATCH /api/orders/[id]` - Update order status (admin)

## Tech Stack
- **Frontend**: Next.js 16, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Railway)
- **ORM**: Drizzle ORM
- **Payments**: PayPal
- **Hosting**: Railway

## Support
For issues or questions, check the Railway logs or contact support.
