import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('API: Fetching product with ID:', id);
    const product = await db.select().from(products).where(eq(products.id, id));
    console.log('API: Found products:', product.length);
    
    if (product.length === 0) {
      console.log('API: Product not found');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    console.log('API: Returning product:', product[0].name);
    return NextResponse.json(product[0]);
  } catch (error) {
    console.error('API Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product', details: String(error) }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await db
      .update(products)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
