import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Update inventory for each item
    for (const item of orderData.items) {
      const productId = item.productId;
      const quantity = item.quantity;
      
      // Get current product
      const product = await db.select().from(products).where(eq(products.id, productId));
      
      if (product.length > 0 && product[0].stock) {
        const newStock = product[0].stock - quantity;
        
        // Update stock
        await db
          .update(products)
          .set({ stock: newStock, updatedAt: new Date() })
          .where(eq(products.id, productId));
        
        console.log(`Updated stock for ${product[0].name}: ${product[0].stock} -> ${newStock}`);
      }
    }
    
    // Generate email content
    const customerEmailContent = generateCustomerEmail(orderData);
    const storeEmailContent = generateStoreEmail(orderData);
    
    // Send emails using Resend
    try {
      // Send customer receipt
      await resend.emails.send({
        from: 'Penjulum <orders@resend.dev>', // Change to 'orders@penjulum.us' after domain verification
        to: orderData.customerEmail,
        subject: 'Your Penjulum Order Confirmation',
        html: customerEmailContent,
      });
      
      console.log('✓ Customer receipt sent to:', orderData.customerEmail);
      
      // Send store notification
      await resend.emails.send({
        from: 'Penjulum <orders@resend.dev>', // Change to 'orders@penjulum.us' after domain verification
        to: 'nvisionmg@gmail.com',
        subject: `New Penjulum Order - $${orderData.total}`,
        html: storeEmailContent,
      });
      
      console.log('✓ Store notification sent to: nvisionmg@gmail.com');
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails - order is still processed
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inventory updated and emails sent' 
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ 
      error: 'Failed to process order',
      details: String(error)
    }, { status: 500 });
  }
}

function generateCustomerEmail(orderData: any): string {
  const itemsHtml = orderData.items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">
        <img src="${item.productImage}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">
        ${item.productName}<br>
        <small>Size: ${item.size} | Color: ${item.color}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        .total { font-size: 18px; font-weight: bold; text-align: right; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PENJULUM</h1>
          <p>Thank You For Your Order!</p>
        </div>
        <div class="content">
          <h2>Order Confirmation</h2>
          <p>Hi ${orderData.customerName},</p>
          <p>Thank you for your purchase! Your order has been confirmed and will be processed shortly.</p>
          
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${orderData.paypalOrderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h3>Shipping Address</h3>
          <p>
            ${orderData.customerName}<br>
            ${orderData.customerAddress}<br>
            ${orderData.customerCity}, ${orderData.customerState} ${orderData.customerZip}<br>
            ${orderData.customerPhone}
          </p>
          
          <h3>Items Ordered</h3>
          <table>
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">Image</th>
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="text-align: right; padding: 20px; background: white;">
            <p><strong>Subtotal:</strong> $${orderData.subtotal}</p>
            <p><strong>Shipping:</strong> $${orderData.shipping}</p>
            <p style="font-size: 20px; color: #000;"><strong>Total:</strong> $${orderData.total}</p>
          </div>
          
          <p style="margin-top: 30px;">We'll send you tracking information once your order ships.</p>
          <p>If you have any questions, please contact us at nvisionmg@gmail.com</p>
          
          <p style="margin-top: 30px;">
            <strong>Wear Your Story,</strong><br>
            The Penjulum Team
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateStoreEmail(orderData: any): string {
  const itemsList = orderData.items.map((item: any) => `
    - ${item.productName} (${item.size}, ${item.color}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
  `).join('\n');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .alert { background: #4CAF50; color: white; padding: 15px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="alert">
          <h2>🎉 New Order Received!</h2>
        </div>
        
        <h3>Order Information</h3>
        <p><strong>Order ID:</strong> ${orderData.paypalOrderId}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Amount:</strong> $${orderData.total}</p>
        
        <h3>Customer Information</h3>
        <p>
          <strong>Name:</strong> ${orderData.customerName}<br>
          <strong>Email:</strong> ${orderData.customerEmail}<br>
          <strong>Phone:</strong> ${orderData.customerPhone}
        </p>
        
        <h3>Shipping Address</h3>
        <p>
          ${orderData.customerAddress}<br>
          ${orderData.customerCity}, ${orderData.customerState} ${orderData.customerZip}
        </p>
        
        <h3>Items Ordered</h3>
        <pre>${itemsList}</pre>
        
        <h3>Order Summary</h3>
        <p>
          Subtotal: $${orderData.subtotal}<br>
          Shipping: $${orderData.shipping}<br>
          <strong>Total: $${orderData.total}</strong>
        </p>
        
        <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;">
          <strong>Action Required:</strong> Process this order and prepare for shipment.
        </p>
      </div>
    </body>
    </html>
  `;
}
