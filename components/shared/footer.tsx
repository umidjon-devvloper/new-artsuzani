"use client";

import Link from "next/link";
import { Heart, Search, LogIn, ShoppingCart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-card/90 backdrop-blur-md border-t border-border mt-20 relative z-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Logo and About */}
          <div className="md:col-span-1 space-y-4">
            <Link href={"/"} className="flex items-center space-x-2 group w-max">
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🪡</span>
              <h2 className="text-2xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wide">
                Artsuzani
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mt-4">
              Discover exquisite, handmade Suzani embroidery from the heart of
              Uzbekistan. Every thread tells a story of heritage and passion.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-foreground">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link prefetch={false} href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link prefetch={false} href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link prefetch={false} href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">Collections</Link>
              </li>
              <li>
                <Link prefetch={false} href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Journal</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-foreground">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link prefetch={false} href="/shopping/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">Your Cart</Link>
              </li>
              <li>
                <Link prefetch={false} href="/favorite" className="text-sm text-muted-foreground hover:text-primary transition-colors">Saved Items</Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Shipping Policy</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Returns & Exchanges</span>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-foreground">Stay Inspired</h3>
            <p className="text-sm text-muted-foreground">
              Sign up for our newsletter to receive updates on new collections and exclusive offers.
            </p>
            <form className="mt-4 flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-background border border-border rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
              <button
                type="button"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-r-md font-medium text-sm transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Artsuzani. All rights reserved. Let the authentic beauty of Bukhara adorn your life.
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
