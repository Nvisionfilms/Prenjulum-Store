const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTables() {
  const client = await pool.connect();
  
  try {
    console.log('Creating tables...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
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
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_email TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        customer_city TEXT NOT NULL,
        customer_state TEXT NOT NULL,
        customer_zip TEXT NOT NULL,
        customer_phone TEXT,
        items JSONB NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        shipping NUMERIC(10, 2) DEFAULT 0,
        total NUMERIC(10, 2) NOT NULL,
        status TEXT DEFAULT 'pending',
        paypal_order_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    `);
    
    console.log('✅ Tables created successfully!');
    
    // Verify
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('products', 'orders');
    `);
    
    console.log('Tables found:', result.rows);
    
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
