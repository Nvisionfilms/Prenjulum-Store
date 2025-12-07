'use client';

import { ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/db/schema';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/products/logo text.png" 
                alt="Penjulum" 
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm uppercase tracking-widest hover:text-gray-300 transition">
                Home
              </Link>
              <Link href="#collection" className="text-sm uppercase tracking-widest hover:text-gray-300 transition">
                Collection
              </Link>
              <Link href="#story" className="text-sm uppercase tracking-widest hover:text-gray-300 transition">
                Our Story
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingBagIcon className="h-6 w-6 hover:text-gray-300 transition" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-sm uppercase tracking-widest">Home</Link>
                <Link href="#collection" className="text-sm uppercase tracking-widest">Collection</Link>
                <Link href="#story" className="text-sm uppercase tracking-widest">Our Story</Link>
                <Link href="/cart" className="text-sm uppercase tracking-widest">Cart</Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/black.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center pt-20">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">
                Premium Denim Collection
              </p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Wear Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Story
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-md mx-auto lg:mx-0 mb-8">
                Premium embroidery meets quality denim. Each piece tells a unique story of craftsmanship and bold self-expression.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="#collection"
                  className="px-8 py-4 bg-white text-black font-medium uppercase tracking-wider hover:bg-gray-200 transition"
                >
                  Shop Now
                </Link>
                <Link 
                  href="#story"
                  className="px-8 py-4 border border-white/30 font-medium uppercase tracking-wider hover:bg-white/10 transition"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Hero Product Image */}
            <div className="relative">
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <img 
                  src="/products/Front Mock.png" 
                  alt="Penjulum Denim"
                  className="w-full h-full object-contain"
                />
                {/* Floating accent elements */}
                <div className="absolute -left-8 top-1/4 w-24 h-24 opacity-60">
                  <img 
                    src="/products/pocket lgoo.png" 
                    alt="Detail"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-white rounded-full" />
            </div>
          </div>
        </section>

        {/* Features Strip */}
        <section className="bg-white text-black py-6">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-sm uppercase tracking-wider font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500 mt-1">On orders over $100</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider font-medium">Premium Quality</p>
                <p className="text-xs text-gray-500 mt-1">Hand-selected denim</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider font-medium">Embroidered</p>
                <p className="text-xs text-gray-500 mt-1">Premium stitching</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider font-medium">Limited Edition</p>
                <p className="text-xs text-gray-500 mt-1">Exclusive designs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Collection Section */}
        <section id="collection" className="py-24 bg-neutral-950">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">
                The Collection
              </p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Signature Pieces
              </h2>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="group">
                    <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden mb-4">
                      <img 
                        src={product.images?.[0] || '/placeholder.png'} 
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                      <button className="absolute bottom-4 left-4 right-4 py-3 bg-white text-black font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">
                        Quick View
                      </button>
                    </div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{product.description?.substring(0, 50)}...</p>
                    <p className="text-lg font-bold mt-2">${product.price}</p>
                    {product.stock && product.stock < 10 && (
                      <p className="text-xs text-red-400 mt-1">Only {product.stock} left!</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Story Section */}
        <section id="story" className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image Side */}
              <div className="relative">
                <div className="aspect-square bg-neutral-900 overflow-hidden">
                  <img 
                    src="/products/back black.jpg" 
                    alt="Craftsmanship"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating detail */}
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-neutral-800 p-4">
                  <img 
                    src="/products/right leg front.png" 
                    alt="Detail"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">
                  Our Story
                </p>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Crafted With
                  <br />
                  Purpose
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  An exclusive denim line for Gen Z, featuring baggy fits, Y2K vibes, and durable washes. Penjulum was born from a passion for self-expression and premium craftsmanship.
                </p>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  Our designs featuring knights and blossoms are meticulously embroidered with premium stitching, representing strength and growth. Every thread, every detail is intentional.
                </p>
                
                {/* Product Info */}
                <div className="border-t border-white/10 pt-6 mb-8">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 uppercase tracking-wider mb-1">Retailer</p>
                      <p className="text-white font-medium">Penjulum.Us</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase tracking-wider mb-1">Manufacturer</p>
                      <p className="text-white font-medium">European Corporations</p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="#collection"
                  className="inline-block px-8 py-4 border border-white font-medium uppercase tracking-wider hover:bg-white hover:text-black transition"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram Feed Section */}
        <section className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Follow Our Journey
              </h2>
              <p className="text-gray-400 mb-6">
                See how our community wears their story
              </p>
              <a 
                href="https://www.instagram.com/penjulum.us/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @penjulum.us
              </a>
            </div>

            {/* Instagram Embed */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-neutral-900 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.instagram.com/penjulum.us/embed"
                  className="w-full"
                  style={{ minHeight: '600px', border: 'none' }}
                  scrolling="no"
                  allowTransparency={true}
                />
              </div>
              <div className="text-center mt-8">
                <a
                  href="https://www.instagram.com/penjulum.us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-white text-black font-medium uppercase tracking-wider hover:bg-gray-200 transition"
                >
                  View on Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-neutral-950">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Movement
            </h2>
            <p className="text-gray-400 mb-8">
              Be the first to know about new drops, exclusive offers, and behind-the-scenes content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
              />
              <button 
                type="submit"
                className="px-8 py-3 bg-white text-black font-medium uppercase tracking-wider hover:bg-gray-200 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <img 
                src="/products/logo text.png" 
                alt="Penjulum" 
                className="h-10 w-auto mb-4"
              />
              <p className="text-gray-400 max-w-sm">
                Premium denim with embroidered artistry. Wear your story.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm uppercase tracking-wider font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#collection" className="hover:text-white transition">Collection</Link></li>
                <li><Link href="/cart" className="hover:text-white transition">Cart</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-wider font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#story" className="hover:text-white transition">Our Story</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Penjulum. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
