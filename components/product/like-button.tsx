"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { toggleFavorite } from "@/actions/favorite.actions";
import { cn } from "@/lib/utils";

/**
 * Mahsulot kartasidagi "yoqtirish" tugmasi — mahsulotni ochmasdan ishlaydi.
 * Tizimga kirmagan foydalanuvchida Clerk oynasi ochiladi.
 */
export default function LikeButton({
  productId,
  initialLiked = false,
  className,
}: {
  productId: string;
  initialLiked?: boolean;
  className?: string;
}) {
  const { userId } = useAuth();
  const [liked, setLiked] = React.useState(initialLiked);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => setLiked(initialLiked), [initialLiked]);

  const base = cn(
    "absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full",
    "bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--border-theme)]/60 shadow-sm",
    "transition-all duration-300 hover:scale-110",
    className,
  );

  // Tizimga kirmagan — Clerk modal
  if (!userId) {
    return (
      <SignInButton mode="modal">
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Sign in to save"
          title="Sign in to save to favorites"
          className={cn(base, "text-[var(--text-secondary)] hover:text-[var(--theme-accent)]")}
        >
          <Heart className="h-5 w-5" />
        </button>
      </SignInButton>
    );
  }

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !liked;
    setLiked(next); // optimistik
    startTransition(async () => {
      try {
        await toggleFavorite(userId, productId);
      } catch {
        setLiked(!next); // qaytarish
        toast.error("Failed to update favorites");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
      title={liked ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        base,
        liked
          ? "text-[var(--theme-accent)] border-[var(--theme-accent)]/60"
          : "text-[var(--text-secondary)] hover:text-[var(--theme-accent)]",
        "disabled:opacity-60",
      )}
    >
      <Heart
        className={cn("h-5 w-5 transition-transform", liked && "scale-110")}
        fill={liked ? "currentColor" : "none"}
      />
    </button>
  );
}
