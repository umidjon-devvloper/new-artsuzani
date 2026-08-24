"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Menu,
  LogIn,
  Paintbrush,
} from "lucide-react";
import UserBox from "@/components/shared/user-box";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import { createUser } from "@/actions/user.actions";
import { cn } from "@/lib/utils";
import Image from "next/image";

const BUHARA_THEMES = [
  {
    id: "theme-bukhara",
    name: "Bukhara Luxury",
    colors: ["bg-[#b32230]", "bg-[#dec576]", "bg-[#f5ebd6]"],
  },
  {
    id: "theme-silkroad",
    name: "Silk Road",
    colors: ["bg-[#1f9468]", "bg-[#dec576]", "bg-[#fcfdfc]"],
  },
  {
    id: "theme-minimal",
    name: "Modern Minimal",
    colors: ["bg-[#414b5c]", "bg-[#d4c8b8]", "bg-[#fbfaf8]"],
  },
  {
    id: "theme-heritage",
    name: "Dark Heritage",
    colors: ["bg-[#b32230]", "bg-[#183c2f]", "bg-[#25191a]"],
  },
];

const Header = ({
  favoriteLength,
  cartLength,
}: {
  favoriteLength: number;
  cartLength: number;
}) => {
  const { user } = useUser();
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const calledRef = useRef(false);

  // Navigatsiya havolalari — bitta joyda (desktop va mobil uchun)
  const NAV_LINKS = [
    { href: "/", label: t("home") },
    { href: "/about", label: "About" },
    { href: "/products", label: t("products") },
    { href: "/marketplays", label: "Marketplays" },
    { href: "/workshop", label: "Workshop" },
    { href: "/blog", label: "Blog" },
    { href: "/orders", label: t("orders") },
  ];

  // Joriy sahifani aniqlaydi (aktiv holatni ko'rsatish uchun)
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const [themeIdx, setThemeIdx] = useState(0);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("bukhara-theme") || "theme-bukhara";
    const idx = BUHARA_THEMES.findIndex((t) => t.id === saved);
    if (idx !== -1) {
      setThemeIdx(idx);
      document.body.className = document.body.className.replace(
        /theme-[a-z]+/,
        "",
      );
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border shadow-soft transition-all duration-500">
      <div className="max-w-8xl mx-auto ">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 sm:px-6">
          {/* Logo */}
          <Link href={"/"} className="flex items-center space-x-2 group">
            <Image
              src="/logo.png"
              alt="Artsuzani"
              width={340}
              height={220}
              priority
              sizes="(max-width: 640px) 96px, 130px"
              className="h-9 w-auto sm:h-12"
            />
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative font-medium transition-colors group",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="hidden lg:flex">
              <LanguageSwitcher />
            </div>
            {/* Theme Switcher Dropdown */}
            <div className="relative group/theme hidden lg:flex">
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
                        document
                          .getElementById("theme-dropdown")
                          ?.classList.add("hidden");
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full p-2 rounded-xl text-left transition-all duration-300 hover:bg-muted/50",
                        themeIdx === i
                          ? "bg-primary/5 text-primary"
                          : "text-foreground",
                      )}
                    >
                      <div className="flex -space-x-1">
                        {theme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-4 h-4 rounded-full border border-border/50 shadow-sm",
                              color,
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

            {/* Favorites */}
            <Link href={"/favorite"} className="sm:block hidden">
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
                <Button
                  size="lg"
                  className="hidden border border-border bg-card text-foreground hover:bg-muted hover:text-primary rounded-full md:flex shadow-sm transition-all duration-300"
                >
                  Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button
                  size="icon"
                  variant="ghost"
                  className="md:hidden"
                  aria-label="Sign in"
                >
                  <LogIn className="w-5 h-5" />
                </Button>
              </SignInButton>
            </SignedOut>

            {/* Cart */}
            <Link href={"/shopping/cart"} className="sm:block hidden">
              <Button
                variant="ghost"
                size="icon"
                className="relative  text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
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
                  aria-label="Open menu"
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
                  {/* Nav links */}
                  <nav className="grid gap-1.5 text-base font-sans">
                    {[...NAV_LINKS, { href: "/contact", label: "Contact" }].map(
                      (l) => {
                        const active = isActive(l.href);
                        return (
                          <SheetClose asChild key={l.href}>
                            <Link
                              href={l.href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "px-3 py-2.5 rounded-lg transition-colors",
                                active
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
                              )}
                            >
                              {l.label}
                            </Link>
                          </SheetClose>
                        );
                      },
                    )}
                  </nav>

                  <Separator />

                  {/* Language Switcher */}
                  <div className="px-2 my-2">
                    <LanguageSwitcher />
                  </div>

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
                            themeIdx === i
                              ? "bg-primary/10 border-primary/50"
                              : "bg-muted/30 hover:bg-muted",
                          )}
                        >
                          <div className="flex -space-x-1 mb-2">
                            {theme.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "w-3 h-3 rounded-full border border-border/50",
                                  color,
                                )}
                              />
                            ))}
                          </div>
                          <span
                            className={cn(
                              "text-xs font-medium text-center leading-tight",
                              themeIdx === i
                                ? "text-primary"
                                : "text-foreground",
                            )}
                          >
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
