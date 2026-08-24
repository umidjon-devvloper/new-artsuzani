import PageHeader from "@/components/shared/page-header";

export type LegalSection = { heading: string; body: string[] };

/**
 * Huquqiy/siyosat sahifalari uchun umumiy shakl (shipping, returns, privacy,
 * terms). Barcha ranglar mavzu tokenlaridan — 4 mavzuda ham o'qiladi.
 */
export default function LegalPage({
  title,
  description,
  updated,
  sections,
}: {
  title: string;
  description?: string;
  updated?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen">
      <PageHeader title={title} description={description} />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        {updated && (
          <p className="mb-10 text-sm text-[var(--text-secondary)]">
            Last updated: {updated}
          </p>
        )}
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3">
                {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p
                  key={j}
                  className="mb-3 text-[var(--text-secondary)] leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
