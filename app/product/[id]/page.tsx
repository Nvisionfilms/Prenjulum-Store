'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Product } from '@/lib/db/schema';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = use(params);
  
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product:', id);
      const res = await fetch(`/api/products/${id}`);
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Product data:', data);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0].name);
        }
      } else {
        console.error('Failed to fetch product:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-32">
          <p>Product not found</p>
          <Link href="/" className="mt-4 inline-block text-gray-400 hover:text-white">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('penjulum-cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id && item.color === selectedColor && item.size === selectedSize);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || '',
        color: selectedColor,
        size: selectedSize
      });
    }
    
    localStorage.setItem('penjulum-cart', JSON.stringify(cart));
    router.push('/cart');
  };

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
            <Link href="/cart" className="hover:text-gray-300 transition">
              <ShoppingBagIcon className="h-6 w-6" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-24">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Collection
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
          {/* Image gallery */}
          <div>
            <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-900">
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMainImage(image)}
                  className={`aspect-square overflow-hidden bg-neutral-900 ${mainImage === image ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'} transition`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 lg:mt-0">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">Penjulum Denim</p>
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

            <div className="mt-4">
              <p className="text-3xl font-bold">${Number(product.price).toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">Free shipping on orders over $100</p>
            </div>

            <div className="mt-8">
              <p className="text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-wider font-medium mb-4">Details</h3>
              <ul className="space-y-2">
                {product.details?.map((detail, index) => (
                  <li key={index} className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-white rounded-full" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <form className="mt-10">
              {/* Color picker */}
              <div>
                <h3 className="text-sm uppercase tracking-wider font-medium mb-3">Color: {selectedColor}</h3>
                <div className="flex gap-2">
                  {product.colors?.map((color) => (
                    <label
                      key={color.name}
                      className={`relative flex cursor-pointer items-center justify-center rounded-full p-1 ${selectedColor === color.name ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
                    >
                      <input
                        type="radio"
                        name="color-choice"
                        value={color.name}
                        checked={selectedColor === color.name}
                        onChange={() => setSelectedColor(color.name)}
                        className="sr-only"
                      />
                      <span
                        className={`h-8 w-8 rounded-full border border-white/20 ${color.bgColor}`}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Size picker */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm uppercase tracking-wider font-medium">Size</h3>
                  <button type="button" className="text-sm text-gray-400 hover:text-white underline">
                    Size guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes?.map((size) => (
                    <label
                      key={size}
                      className={`flex items-center justify-center py-3 text-sm font-medium cursor-pointer transition ${selectedSize === size ? 'bg-white text-black' : 'border border-white/20 text-white hover:border-white'}`}
                    >
                      <input
                        type="radio"
                        name="size-choice"
                        value={size}
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(size)}
                        className="sr-only"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={addToCart}
                className="mt-10 w-full py-4 bg-white text-black font-medium uppercase tracking-wider hover:bg-gray-200 transition"
              >
                Add to Bag — ${Number(product.price).toFixed(2)}
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Secure checkout with PayPal
              </p>
            </form>
          </div>
        </div>
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
