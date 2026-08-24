/**
 * Root segment yuklanish holati.
 * Sahifa server'da ma'lumot olayotganda skelet ko'rinadi (bo'sh ekran emas).
 */
export default function Loading() {
  return (
    <div className="min-h-screen pt-24 px-4 max-w-8xl mx-auto animate-pulse">
      {/* Hero skelet */}
      <div className="w-full h-[52vh] min-h-[460px] max-h-[560px] rounded-[32px] bg-muted mb-16" />

      {/* Sarlavha skeleti */}
      <div className="h-10 w-64 bg-muted rounded-lg mb-8" />

      {/* Kartalar to'ri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-[var(--card-bg)]">
            <div className="h-80 w-full bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
