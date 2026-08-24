"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

/**
 * Root segment xatolik chegarasi (error boundary).
 * Server yoki render xatosi butun saytni yiqitmaydi — foydalanuvchi
 * chiroyli xabar ko'radi va qayta urinishi mumkin.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root segment error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 mt-24">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <svg
          className="h-9 w-9 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
        Nimadir xato ketdi
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Sahifani yuklashda kutilmagan xatolik yuz berdi. Iltimos, qayta urinib
        ko&apos;ring.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={reset}
          size="lg"
          className="rounded-full px-8 bg-gradient-primary text-white border-none shadow-elegant hover:opacity-90"
        >
          Qayta urinish
        </Button>
        <Link href="/">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-border"
          >
            Bosh sahifa
          </Button>
        </Link>
      </div>
    </div>
  );
}
