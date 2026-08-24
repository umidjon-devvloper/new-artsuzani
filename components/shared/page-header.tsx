import type { ReactNode } from "react";

/**
 * Ichki sahifalar uchun umumiy sarlavha bloki.
 *
 * Barcha ranglar mavzu tokenlaridan olinadi (bg-background, text-foreground,
 * --theme-accent), shuning uchun 4 ta mavzuda ham to'g'ri ko'rinadi va
 * hech qachon "oq ustiga oq" holati bo'lmaydi.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    // pt-28: yuqoridagi fixed navbar (80px) tagiga tushib qolmasligi uchun
    <header className="border-b border-border bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-14 md:pt-36 md:pb-20 text-center">
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--theme-accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
