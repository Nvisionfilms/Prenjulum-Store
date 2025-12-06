import { pgTable, uuid, text, decimal, integer, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  sizes: jsonb('sizes').$type<string[]>().default([]),
  colors: jsonb('colors').$type<{ name: string; bgColor: string }[]>().default([]),
  images: jsonb('images').$type<string[]>().default([]),
  details: jsonb('details').$type<string[]>().default([]),
  category: text('category').default('denim'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  customerAddress: text('customer_address').notNull(),
  customerCity: text('customer_city').notNull(),
  customerState: text('customer_state').notNull(),
  customerZip: text('customer_zip').notNull(),
  customerPhone: text('customer_phone'),
  items: jsonb('items').$type<OrderItem[]>().notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shipping: decimal('shipping', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').$type<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>().default('pending'),
  paypalOrderId: text('paypal_order_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
