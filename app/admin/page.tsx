'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Order } from '@/lib/db/schema';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } else {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      fetchData();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center">
              <img 
                src="/products/logo text.png" 
                alt="Penjulum" 
                className="h-10 w-auto"
              />
            </Link>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Link href="/" className="text-sm uppercase tracking-widest hover:text-gray-300 transition">
              Back to Store
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium uppercase tracking-wider transition ${
              activeTab === 'products'
                ? 'border-b-2 border-white text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium uppercase tracking-wider transition ${
              activeTab === 'orders'
                ? 'border-b-2 border-white text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Orders
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Inventory Management</h2>
                  <Link
                    href="/admin/products/new"
                    className="px-6 py-3 bg-white text-black font-medium uppercase tracking-wider hover:bg-gray-200 transition"
                  >
                    Add Product
                  </Link>
                </div>
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-neutral-900 p-6 rounded-lg">
                      <div className="flex items-center gap-6">
                        <img
                          src={product.images?.[0] || '/placeholder.png'}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{product.name}</h3>
                          <p className="text-gray-400">${product.price}</p>
                          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <label className="text-sm text-gray-400 block mb-1">Stock</label>
                            <input
                              type="number"
                              value={product.stock || 0}
                              onChange={(e) => updateStock(product.id, parseInt(e.target.value))}
                              className="w-24 px-3 py-2 bg-black border border-white/20 rounded text-white"
                            />
                          </div>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="px-4 py-2 border border-white/30 hover:bg-white/10 transition rounded"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Order Management</h2>
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-neutral-900 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{order.customerName}</h3>
                          <p className="text-sm text-gray-400">{order.customerEmail}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${order.total}</p>
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="mt-2 px-3 py-1 bg-black border border-white/20 rounded text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="text-sm font-medium mb-2">Items:</h4>
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="text-sm text-gray-400">
                            {item.productName} - Size: {item.size} - Qty: {item.quantity} - ${item.price}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-gray-400">
                        <p>Shipping Address:</p>
                        <p>{order.customerAddress}, {order.customerCity}, {order.customerState} {order.customerZip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
