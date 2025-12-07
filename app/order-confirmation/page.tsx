'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      // Fetch order details
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => setOrder(data))
        .catch(err => console.error('Error fetching order:', err));
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center">
              <img 
                src="/products/logo text.png" 
                alt="Penjulum" 
                className="h-10 w-auto"
              />
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center mb-12">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Payment Confirmed!
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Thank you for your purchase from Penjulum.
          </p>
          <p className="text-green-500 font-medium">
            ✓ Receipt sent to your email
          </p>
          <p className="text-green-500 font-medium">
            ✓ Order confirmation sent to store
          </p>
        </div>

        {order && (
          <div className="bg-neutral-900 rounded-lg p-8 mb-8">
            <div className="border-b border-white/10 pb-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">PayPal Transaction</p>
                  <p className="font-medium text-xs">{order.paypalOrderId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium text-lg">${order.total}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-white/10 pb-6 mb-6">
              <h3 className="font-medium mb-4">Shipping Address</h3>
              <p className="text-gray-400">
                {order.customerName}<br />
                {order.customerAddress}<br />
                {order.customerCity}, {order.customerState} {order.customerZip}<br />
                {order.customerPhone}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <img 
                      src={item.productImage} 
                      alt={item.productName}
                      className="w-20 h-20 object-cover bg-neutral-800 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-400">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center space-y-4">
          <p className="text-gray-400">
            We'll send tracking information to your email once your order ships.
          </p>
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-white text-black font-medium uppercase tracking-wider hover:bg-gray-200 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <img 
            src="/products/logo text.png" 
            alt="Penjulum" 
            className="h-8 w-auto mx-auto mb-4"
          />
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Penjulum. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
