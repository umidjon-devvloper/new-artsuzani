"use client";

import React, { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Home, Search, Grid, ShoppingCart, Package, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface MobileBottomNavProps {
  cartLength: number;
  pendingOrderCount?: number;
}

const MobileBottomNav = ({ cartLength, pendingOrderCount = 0 }: MobileBottomNavProps) => {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const { isLoaded, isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when completely at top or scrolling up
      if (currentScrollY < 10 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } 
      // Hide when scrolling down past 50px
      else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      label: t("home"),
      icon: Home,
      href: "/",
      matchExact: true,
    },
    {
      label: t("products"),
      icon: Search,
      href: "/products", // Assuming products is the main search/browse area
      matchExact: false,
    },
    {
      label: "Favorites",
      icon: Heart,
      href: "/favorite",
      matchExact: false,
    },
    {
      label: t("cart"),
      icon: ShoppingCart,
      href: "/shopping/cart",
      badge: cartLength,
      matchExact: false,
    },
    {
      label: t("orders"),
      icon: Package,
      href: "/orders",
      badge: pendingOrderCount,
      matchExact: false,
    },
    {
      label: t("profile"),
      icon: User,
      href: isLoaded && isSignedIn ? "/profile" : "/", 
      matchExact: false,
    },

  ];

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
        "bg-[#2B1414]/90 backdrop-blur-xl border-t border-[#D4AF37]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] rounded-t-2xl"
      )}
    >
      {/* Safe area padding for newer iPhones */}
      <div className="flex justify-around items-center px-1 pb-safe pt-2 mb-2 sm:mb-3">
        {navItems.map((item) => {
          const isActive = item.matchExact 
            ? pathname === item.href 
            : pathname.startsWith(item.href) && item.href !== "/";
          
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 w-[48px] h-[52px] transition-all duration-300 group origin-center",
                isActive ? "text-[#D4AF37]" : "text-[#F5F1E8]/60 hover:text-[#F5F1E8]"
              )}
            >
              {/* Interaction Ripple/Glow background */}
              {isActive && (
                <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-xl blur-sm -z-10 animate-fade-in" />
              )}
              
              <div className="relative">
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 ease-spring",
                    isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : "group-hover:scale-105"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {/* Badge Support */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    "absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold rounded-full shadow-sm blink-soft",
                    isActive 
                      ? "bg-[#D4AF37] text-black" 
                      : "bg-[#8B1E2D] text-white"
                  )}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span className={cn(
                "text-[9px] font-medium mt-1 font-sans transition-all duration-300",
                isActive ? "text-[#D4AF37] opacity-100" : "opacity-70 group-hover:opacity-100"
              )}>
                {item.label}
              </span>

              {/* Active Underline Indicator */}
              <div 
                className={cn(
                  "absolute -bottom-1 w-1 h-1 rounded-full bg-[#D4AF37] transition-all duration-300",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                )} 
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
