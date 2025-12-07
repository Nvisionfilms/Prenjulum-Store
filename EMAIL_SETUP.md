# Email Setup Guide for Penjulum Store

## Current Implementation

The order confirmation system is set up and working! Here's what happens after a successful payment:

### ✅ What's Working Now:
1. **Payment Confirmation** - Customer completes PayPal payment
2. **Order Saved** - Order details saved to Railway database
3. **Inventory Updated** - Product stock automatically reduced
4. **Receipt Page** - Customer sees order confirmation at `/order-confirmation`
5. **Email Templates Ready** - HTML email templates generated (currently logged to console)

### 📧 Email Flow:
- **Customer Email**: Receipt with order details, items, shipping address, and total
- **Store Email** (nvisionmg@gmail.com): New order notification with customer info and items

---

## To Enable Actual Email Sending

Currently, emails are logged to the console. To send real emails, choose one of these services:

### Option 1: Resend (Recommended - Easiest)
**Free tier: 3,000 emails/month**

1. Sign up at https://resend.com
2. Verify your domain (penjulum.us) or use resend's test domain
3. Get your API key
4. Install: `npm install resend`
5. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
6. Update `app/api/send-receipt/route.ts`:
   ```typescript
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   // Replace console.log with:
   await resend.emails.send({
     from: 'orders@penjulum.us',
     to: orderData.customerEmail,
     subject: 'Your Penjulum Order Confirmation',
     html: customerEmailContent,
   });
   
   await resend.emails.send({
     from: 'orders@penjulum.us',
     to: 'nvisionmg@gmail.com',
     subject: 'New Penjulum Order',
     html: storeEmailContent,
   });
   ```

### Option 2: SendGrid
**Free tier: 100 emails/day**

1. Sign up at https://sendgrid.com
2. Get API key
3. Install: `npm install @sendgrid/mail`
4. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```
5. Update code similarly

### Option 3: Gmail SMTP (Simple but limited)
**Free: 500 emails/day**

1. Enable 2FA on your Gmail
2. Create an App Password
3. Install: `npm install nodemailer`
4. Add to `.env.local`:
   ```
   GMAIL_USER=nvisionmg@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

---

## What Happens After Payment

### Customer Experience:
1. ✅ Completes PayPal payment
2. ✅ Sees "Payment Confirmed!" page
3. ✅ Receives email receipt (when email is enabled)
4. ✅ Can view order details on confirmation page

### Store Owner (You):
1. ✅ Receives email notification (when enabled)
2. ✅ Order saved in Railway database
3. ✅ Inventory automatically reduced
4. ✅ Can view order in admin dashboard

### Inventory Management:
- **Automatic**: When payment is confirmed, stock is reduced for each item
- **Example**: Customer buys 2 pairs of size 32 → stock goes from 14 to 12
- **Database**: Updates `products` table `stock` field

---

## Testing

### Current Setup (Console Logs):
1. Make a test purchase
2. Check terminal/console for email content
3. Verify inventory reduced in database:
   ```sql
   SELECT name, stock FROM products;
   ```

### After Email Setup:
1. Use PayPal Sandbox for testing
2. Check both customer and store emails
3. Verify all order details are correct

---

## Files Modified:
- ✅ `app/cart/page.tsx` - Calls send-receipt API after payment
- ✅ `app/api/send-receipt/route.ts` - Handles emails and inventory
- ✅ `app/order-confirmation/page.tsx` - Shows receipt to customer
- ✅ `app/api/orders/[id]/route.ts` - Fetches order details

---

## Next Steps:
1. Choose an email service (Resend recommended)
2. Sign up and get API key
3. Add API key to `.env.local`
4. Update `app/api/send-receipt/route.ts` with actual email sending
5. Test with a real order!

---

## Support:
If you need help setting up emails, let me know which service you prefer and I'll help you integrate it!
