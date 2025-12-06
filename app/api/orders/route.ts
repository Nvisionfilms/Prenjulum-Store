import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allOrders = await db.select().from(orders);
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create the order
    const newOrder = await db.insert(orders).values(body).returning();
    
    // Update product stock
    for (const item of body.items) {
      const currentProduct = await db.select().from(products).where(eq(products.id, item.productId));
      if (currentProduct.length > 0) {
        const newStock = (currentProduct[0].stock || 0) - item.quantity;
        await db
          .update(products)
          .set({ stock: newStock })
          .where(eq(products.id, item.productId));
      }
    }
    
    return NextResponse.json(newOrder[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
