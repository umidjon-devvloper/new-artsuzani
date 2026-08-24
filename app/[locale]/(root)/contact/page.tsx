import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/page-header";
import { absoluteUrl } from "@/lib/site";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";

/* DIQQAT: quyidagi kontakt ma'lumotlari NAMUNA — haqiqiysi bilan almashtiriladi. */
const WHATSAPP_PHONE = "998917767714";
const EMAIL = "info@artsuzani.com"; // namuna
const ADDRESS = "Bukhara, Uzbekistan"; // namuna

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: "Contact",
    description:
      "Get in touch with Artsuzani — questions about our handmade Suzani, orders, or the Bukhara embroidery workshop.",
    alternates: { canonical: absoluteUrl(locale, "/contact") },
  };
}

export default function ContactPage() {
  const waUrl = `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
    "Hello Artsuzani! I have a question."
  )}&type=phone_number&app_absent=0`;

  const items = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+998 91 776 77 14",
      href: waUrl,
      note: "Fastest way to reach us",
    },
    {
      icon: Mail,
      title: "Email",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      note: "We reply within 24 hours",
    },
    { icon: MapPin, title: "Location", value: ADDRESS, note: "Home of Suzani embroidery" },
    { icon: Clock, title: "Hours", value: "Mon–Sat, 9:00–18:00", note: "Local time (GMT+5)" },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        description="Have a question about our handmade Suzani, an order, or the Bukhara workshop? We would love to hear from you."
      />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((it, i) => {
            const Icon = it.icon;
            const card = (
              <div className="h-full rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-shadow hover:shadow-elegant-light">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--theme-accent)]/10">
                  <Icon className="h-6 w-6 text-[var(--theme-accent)]" />
                </div>
                <h2 className="font-semibold text-[var(--text-primary)]">{it.title}</h2>
                <p className="mt-1 text-[var(--text-primary)]">{it.value}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{it.note}</p>
              </div>
            );
            return it.href ? (
              <a
                key={i}
                href={it.href}
                target={it.href.startsWith("http") ? "_blank" : undefined}
                rel={it.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]/50 rounded-2xl"
              >
                {card}
              </a>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-[var(--border-theme)] bg-[var(--bg-secondary)] p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-3">
            Prefer to chat?
          </h2>
          <p className="mx-auto max-w-md text-[var(--text-secondary)] mb-6">
            Message us directly on WhatsApp — we usually reply within a few hours.
          </p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-full px-8 h-14 bg-gradient-primary text-white border-none shadow-elegant hover:opacity-90">
              <MessageCircle className="mr-2 h-5 w-5" /> Message on WhatsApp
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
