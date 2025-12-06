'use client';

import { useState, useEffect } from 'react';
import { ShoppingBagIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('penjulum-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('penjulum-cart', JSON.stringify(newCart));
  };

  const removeFromCart = (id: number) => {
    updateCart(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    updateCart(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center">
              <img 
                src="/products/logo text.png" 
                alt="Penjulum" 
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="text-sm font-medium">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-8">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
          <ArrowLeftIcon className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold mb-12">Your Bag</h1>
        
        {!isLoaded ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-6">Your bag is empty</p>
            <Link
              href="/"
              className="inline-block bg-white text-black py-3 px-8 font-medium uppercase tracking-wider hover:bg-gray-200 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-7">
              <ul className="divide-y divide-white/10">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-8 flex gap-6">
                    <div className="flex-shrink-0 w-32 h-40 bg-neutral-900 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          {item.size && (
                            <p className="text-sm text-gray-400 mt-1">Size: {item.size}</p>
                          )}
                          {item.color && (
                            <p className="text-sm text-gray-400">Color: {item.color}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-white transition"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between">
                        <div className="flex items-center border border-white/20">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-white/10 transition"
                          >
                            −
                          </button>
                          <span className="px-4 py-2 border-l border-r border-white/20">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-white/10 transition"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 lg:mt-0 lg:col-span-5">
              <div className="bg-neutral-900 p-8">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400">Subtotal</p>
                    <p className="font-medium">${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400">Shipping</p>
                    <p className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </p>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-gray-500">
                      Free shipping on orders over $100
                    </p>
                  )}
                  <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                    <p className="text-lg font-medium">Total</p>
                    <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full mt-8 px-8 py-4 bg-white text-black font-medium uppercase tracking-wider hover:bg-gray-200 transition"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <>
                    <div className="mt-8 space-y-4">
                      <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded text-white placeholder-gray-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded text-white placeholder-gray-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded text-white placeholder-gray-500"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                          className="px-4 py-3 bg-black border border-white/20 rounded text-white placeholder-gray-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={customerInfo.state}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                          className="px-4 py-3 bg-black border border-white/20 rounded text-white placeholder-gray-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={customerInfo.zip}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, zip: e.target.value })}
                          className="px-4 py-3 bg-black border border-white/20 rounded text-white placeholder-gray-500"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          className="px-4 py-3 bg-black border border-white/20 rounded text-white placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test' }}>
                    <PayPalButtons 
                      style={{ layout: "vertical", color: "white", shape: "rect" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: 'CAPTURE',
                          purchase_units: [
                            {
                              amount: {
                                value: total.toFixed(2),
                                currency_code: "USD"
                              },
                              description: `Penjulum Order`,
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const order = await actions.order?.capture();
                          console.log('Order completed:', order);
                          
                          // Save order to database
                          if (customerInfo.name && customerInfo.email) {
                            const orderData = {
                              customerEmail: customerInfo.email,
                              customerName: customerInfo.name,
                              customerAddress: customerInfo.address,
                              customerCity: customerInfo.city,
                              customerState: customerInfo.state,
                              customerZip: customerInfo.zip,
                              customerPhone: customerInfo.phone,
                              items: cartItems.map(item => ({
                                productId: item.id.toString(),
                                productName: item.name,
                                productImage: item.image,
                                size: item.size || '',
                                color: item.color || '',
                                quantity: item.quantity,
                                price: item.price,
                              })),
                              subtotal: subtotal.toString(),
                              shipping: shipping.toString(),
                              total: total.toString(),
                              paypalOrderId: order?.id,
                            };
                            
                            await fetch('/api/orders', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(orderData),
                            });
                          }
                          
                          alert('Payment successful! Thank you for your purchase.');
                          localStorage.removeItem('penjulum-cart');
                          setCartItems([]);
                          setShowCheckout(false);
                        } catch (err) {
                          console.error('Error capturing order:', err);
                          alert('There was an error processing your payment. Please try again.');
                        }
                      }}
                      onError={(err) => {
                        console.error('PayPal error:', err);
                        alert('There was an error with PayPal. Please try again.');
                      }}
                    />
                      </PayPalScriptProvider>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-500">
                      Secure checkout powered by PayPal
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

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
