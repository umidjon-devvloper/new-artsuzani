"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, Heart, Menu, LogIn, Palette, X, Paintbrush } from "lucide-react";
import UserBox from "@/components/shared/user-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { createUser } from "@/actions/user.actions";
import { cn } from "@/lib/utils";

const BUHARA_THEMES = [
  { id: "theme-bukhara", name: "Bukhara Luxury", colors: ["bg-[#b32230]", "bg-[#dec576]", "bg-[#f5ebd6]"] },
  { id: "theme-silkroad", name: "Silk Road", colors: ["bg-[#1f9468]", "bg-[#dec576]", "bg-[#fcfdfc]"] },
  { id: "theme-minimal", name: "Modern Minimal", colors: ["bg-[#414b5c]", "bg-[#d4c8b8]", "bg-[#fbfaf8]"] },
  { id: "theme-heritage", name: "Dark Heritage", colors: ["bg-[#b32230]", "bg-[#183c2f]", "bg-[#25191a]"] },
];

const Header = ({
  favoriteLength,
  cartLength,
}: {
  favoriteLength: number;
  cartLength: number;
}) => {
  const { user } = useUser();
  const calledRef = useRef(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("bukhara-theme") || "theme-bukhara";
    const idx = BUHARA_THEMES.findIndex((t) => t.id === saved);
    if (idx !== -1) {
      setThemeIdx(idx);
      document.body.className = document.body.className.replace(/theme-[a-z]+/, "");
      document.body.classList.add(saved);
    } else {
      document.body.classList.add("theme-bukhara");
    }
  }, []);

  const changeTheme = (idx: number) => {
    setThemeIdx(idx);
    const themeId = BUHARA_THEMES[idx].id;
    
    // Remove old themes
    BUHARA_THEMES.forEach((t) => document.body.classList.remove(t.id));
    // Add new theme
    document.body.classList.add(themeId);
    localStorage.setItem("bukhara-theme", themeId);
  };

  // LIVE SEARCH (debounce + abort)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch (e: any) {
        if (e?.name !== "AbortError") console.error("Qidiruv xatosi:", e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  // Clerk createUser
  useEffect(() => {
    if (!user || calledRef.current) return;
    const key = `userCreated:${user.id}`;
    if (typeof window !== "undefined" && localStorage.getItem(key)) {
      calledRef.current = true;
      return;
    }
    const payload = {
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      fullName: user.fullName ?? "",
      picture: user.imageUrl ?? "",
    };
    if (!payload.email) {
      calledRef.current = true;
      console.warn("Email yo‘q, createUser chaqirilmaydi");
      return;
    }
    calledRef.current = true;
    (async () => {
      try {
        await createUser(payload);
        localStorage.setItem(key, "1");
      } catch (e) {
        console.error("createUser xatosi:", e);
        calledRef.current = false;
      }
    })();
  }, [user]);

  // dropdown outside click
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border shadow-soft transition-all duration-500">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={"/"} className="flex items-center space-x-2 group">
            <span className="text-3xl transition-transform duration-300 group-hover:scale-110 drop-shadow-sm">🪡</span>
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-wide group-hover:text-primary transition-colors duration-300">
              Artsuzani
            </h1>
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
            >
              Blogs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/orders"
              className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
            >
              Orders
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right */}
          <div className="flex items-center space-x-5" ref={wrapRef}>
            {/* Theme Switcher Dropdown */}
            <div className="relative group/theme hidden sm:flex">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const el = document.getElementById("theme-dropdown");
                  if (el) el.classList.toggle("hidden");
                }}
                className="rounded-full border-border bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-elegant-light transition-all duration-300"
                title="Change Theme Color"
              >
                <Paintbrush className="w-4 h-4 text-primary group-hover/theme:scale-110 transition-transform" />
              </Button>
              <div 
                id="theme-dropdown"
                className="hidden absolute top-full right-0 mt-3 w-56 p-2 rounded-2xl shadow-elegant-light border border-border/60 bg-background/95 backdrop-blur-xl z-[60] animate-in fade-in slide-in-from-top-4 duration-300"
              >
                <div className="mb-2 px-2 pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                    Select Theme
                  </h4>
                </div>
                <div className="grid gap-1">
                  {BUHARA_THEMES.map((theme, i) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        changeTheme(i);
                        document.getElementById("theme-dropdown")?.classList.add("hidden");
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full p-2 rounded-xl text-left transition-all duration-300 hover:bg-muted/50",
                        themeIdx === i ? "bg-primary/5 text-primary" : "text-foreground"
                      )}
                    >
                      <div className="flex -space-x-1">
                        {theme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-4 h-4 rounded-full border border-border/50 shadow-sm",
                              color
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium font-sans">
                        {theme.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search (desktop) */}
            <div className="hidden sm:flex items-center relative group">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Explore authentic pieces..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query && results.length && setOpen(true)}
                  className="w-72 pl-12 pr-10 py-5 bg-background/50 backdrop-blur-sm border-border/80 focus-visible:ring-primary rounded-full shadow-sm transition-all duration-300 group-hover:shadow-elegant-light font-sans text-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                
                {/* Clear button */}
                {query && (
                  <button 
                    onClick={() => { setQuery(""); setOpen(false); }} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Dropdown */}
              {open && (
                <div className="absolute top-full left-0 mt-3 bg-white border border-border/50 rounded-2xl shadow-elegant-light w-80 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                  {loading && (
                    <div className="p-6 flex items-center justify-center text-sm text-muted-foreground font-sans">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-3"></div>
                      Searching masterworks...
                    </div>
                  )}
                  {!loading && results.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground font-sans">
                      No matching pieces found.
                    </div>
                  )}
                  {!loading &&
                    results.map((item: any) => {
                      // Highlight matching substring
                      const indexMatch = item.title.toLowerCase().indexOf(query.toLowerCase());
                      const beforeMatch = item.title.substring(0, indexMatch);
                      const matchText = item.title.substring(indexMatch, indexMatch + query.length);
                      const afterMatch = item.title.substring(indexMatch + query.length);

                      return (
                        <Link
                          key={item._id}
                          href={`/products/${item._id}`}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                          onClick={() => setOpen(false)}
                        >
                          {/* Image preview or fallback icon */}
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.title} className="w-12 h-12 object-cover rounded-md shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xl shadow-sm">🪡</div>
                          )}
                          <div className="flex-1 font-sans text-sm font-medium text-foreground line-clamp-2">
                            {indexMatch >= 0 ? (
                              <>
                                {beforeMatch}
                                <span className="bg-primary/20 text-primary font-bold px-0.5 rounded-sm">{matchText}</span>
                                {afterMatch}
                              </>
                            ) : (
                              item.title
                            )}
                          </div>
                        </Link>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Favorites */}
            <Link href={"/favorite"}>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
                {favoriteLength ? (
                  <span className="absolute -top-1 -right-1 bg-primary rounded-full w-5 h-5 flex items-center justify-center text-primary-foreground text-xs shadow-md">
                    {favoriteLength}
                  </span>
                ) : null}
              </Button>
            </Link>

            {/* Auth */}
            <SignedIn>
              <div className="hover:scale-105 transition-transform">
                <UserBox />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="hidden border-border bg-white text-foreground hover:bg-gray-50 hover:text-primary rounded-full md:flex shadow-sm transition-all duration-300">
                  Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="icon" variant="ghost" className="md:hidden">
                  <LogIn className="w-5 h-5" />
                </Button>
              </SignInButton>
            </SignedOut>

            {/* Cart */}
            <Link href={"/shopping/cart"}>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center shadow-md">
                  {cartLength ? cartLength : 0}
                </span>
              </Button>
            </Link>

            {/* MOBILE MENU (shadcn Sheet) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[85vw] sm:w-[380px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-4 p-2">
                  {/* Mobile search */}
                  <div className="relative">
                    <Input
                      placeholder="Search products..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    {query && (
                      <div className="absolute z-10 left-0 right-0 mt-2 bg-white border rounded-lg shadow max-h-72 overflow-y-auto">
                        {loading && (
                          <div className="p-3 text-sm text-gray-500">
                            Searching…
                          </div>
                        )}
                        {!loading && results.length === 0 && (
                          <div className="p-3 text-sm text-gray-500">
                            No results found
                          </div>
                        )}
                        {!loading &&
                          results.map((item: any) => (
                            <Link
                              key={item._id}
                              href={`/products/${item._id}`}
                              className="block px-3 py-2 hover:bg-gray-100"
                            >
                              {item.title}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Nav links */}
                  <nav className="grid gap-2 text-base font-sans">
                    <Link
                      href="/"
                      className="px-2 py-2 rounded hover:bg-accent hover:text-accent-foreground"
                    >
                      Home
                    </Link>
                    <Link
                      href="/about"
                      className="px-2 py-2 rounded hover:bg-accent hover:text-accent-foreground"
                    >
                      About
                    </Link>
                    <Link
                      href="/products"
                      className="px-2 py-2 rounded hover:bg-accent hover:text-accent-foreground"
                    >
                      Products
                    </Link>
                    <Link
                      href="/blog"
                      className="px-2 py-2 rounded hover:bg-accent hover:text-accent-foreground"
                    >
                      BLOG
                    </Link>
                    <Link
                      href="/orders"
                      className="px-2 py-2 rounded hover:bg-accent hover:text-accent-foreground"
                    >
                      Orders
                    </Link>
                  </nav>

                  <Separator />
                  
                  {/* Mobile Theme Switcher */}
                  <div className="grid gap-2 font-sans">
                    <h4 className="px-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Theme
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {BUHARA_THEMES.map((theme, i) => (
                        <button
                          key={theme.id}
                          onClick={() => changeTheme(i)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border border-border/50 transition-all duration-300",
                            themeIdx === i ? "bg-primary/10 border-primary/50" : "bg-muted/30 hover:bg-muted"
                          )}
                        >
                          <div className="flex -space-x-1 mb-2">
                            {theme.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "w-3 h-3 rounded-full border border-border/50",
                                  color
                                )}
                              />
                            ))}
                          </div>
                          <span className={cn(
                            "text-xs font-medium text-center leading-tight",
                            themeIdx === i ? "text-primary" : "text-foreground"
                          )}>
                            {theme.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/favorite">
                      <Button
                        variant="secondary"
                        className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                        {favoriteLength ? (
                          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground shadow-sm">
                            {favoriteLength}
                          </span>
                        ) : null}
                      </Button>
                    </Link>

                    <Link href="/shopping/cart">
                      <Button
                        variant="secondary"
                        className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Cart
                        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground shadow-sm">
                          {cartLength ? cartLength : 0}
                        </span>
                      </Button>
                    </Link>
                  </div>

                  <Separator />

                  {/* Auth area */}
                  <div className="flex items-center justify-between">
                    <SignedIn>
                      <UserBox />
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button className="rounded-full">Login</Button>
                      </SignInButton>
                    </SignedOut>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
