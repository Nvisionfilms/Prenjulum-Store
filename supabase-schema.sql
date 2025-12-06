-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  sizes JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  details JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'denim',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL,
  customer_zip TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  paypal_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: Allow public read access, admin write access
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Orders: Customers can view their own orders, admin can view all
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can manage orders"
  ON orders FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert initial product (Penjulum Classic)
INSERT INTO products (name, description, price, stock, sizes, colors, images, details, category)
VALUES (
  'Penjulum Classic',
  'Our signature black denim featuring embroidered knight and blossom artwork with premium stitching. Each pair is a unique piece of wearable art, crafted with premium materials and attention to detail.',
  129.99,
  50,
  '["28", "30", "32", "34", "36", "38"]'::jsonb,
  '[{"name": "Black", "bgColor": "bg-black"}]'::jsonb,
  '["/products/Front Mock.png", "/products/Back Mock.png", "/products/front black.png", "/products/back black.jpg", "/products/left leg front.png", "/products/right leg front.png", "/products/pocket lgoo.png"]'::jsonb,
  '["98% Cotton, 2% Elastane", "Mid-rise slim fit", "Embroidered knight & blossom details", "Premium stitching throughout", "Signature Penjulum pocket branding", "Button closure with branded hardware", "Machine wash cold, hang dry"]'::jsonb,
  'denim'
);
