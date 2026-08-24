import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/page-header";
import Reveal from "@/components/shared/reveal";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import {
  Clock,
  MapPin,
  Users,
  Scissors,
  Palette,
  Sparkles,
  Star,
  Globe,
  MessageCircle,
} from "lucide-react";

/*
 * DIQQAT: Bu sahifadagi matn, narx va rasmlar hozircha NAMUNA (placeholder).
 * Haqiqiy ma'lumot bilan almashtiriladi. Rasmlar UploadThing'ga yuklanib,
 * quyidagi WORKSHOP_PHOTOS va MASTER.photo qiymatlariga qo'yiladi.
 */

const WHATSAPP_PHONE = "998917767714";

function bookingUrl(text: string) {
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
    text
  )}&type=phone_number&app_absent=0`;
}

// --- NAMUNA MA'LUMOTLAR ---
const PRICE = { amount: 45, currency: "USD", unit: "per person" };

const PROGRAM = [
  { time: "0–15 min", title: "Welcome & introduction", desc: "Tea, history of Suzani, and an overview of the tools and threads." },
  { time: "15–45 min", title: "Learn the core stitches", desc: "Basma and yurma — the foundational Bukhara embroidery techniques." },
  { time: "45–90 min", title: "Stitch your own piece", desc: "Work on a small pattern to take home as a handmade souvenir." },
  { time: "90–120 min", title: "Finishing & photos", desc: "Finish your work, ask questions, and capture the memory." },
];

const LEARN = [
  { icon: Scissors, title: "Traditional stitches", desc: "Master the basma and yurma techniques used for centuries in Bukhara." },
  { icon: Palette, title: "Colour & pattern", desc: "How natural dyes and symbolic motifs come together in a Suzani." },
  { icon: Sparkles, title: "Thread selection", desc: "Choosing silk threads and preparing the fabric like a true artisan." },
  { icon: Users, title: "Cultural context", desc: "The meaning behind the patterns and the role of Suzani in Uzbek life." },
];

// "What is the workshop?" bo'limi uchun rasm (landscape)
const HERO_IMAGE =
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMWXiyC9jS0BRiav3Nt7P4SojDkJnf2TKAzdgYF";

// Galereya rasmlari (Master bio rasmi hali yo'q — bio bo'limi hozircha yashirin)
const WORKSHOP_PHOTOS: string[] = [
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMWTDqznKW3XKj9QsUd1nuC62aGpoeVg7RqHlLh",
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMWfYhRdUpB6BgTeJ2QryWLtCmlqc0sUHPE1iYZ",
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMW6990CfeVxJ9GtgFlWcQMhDd7ZYEbefvBrwiz",
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMWsky5h6xILxPzvu6UMy9Sik2R5a7eOHgW1XEd",
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMW6ZMzoKeVxJ9GtgFlWcQMhDd7ZYEbefvBrwiz",
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMWUCQRvhmoPHrmxuQfVy2vGqh6FI74bplNgnct",
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMW5xf4LQR2vS8gDqIXahLwMJtoKQHb35VNzUFB",
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMW38SQvxl0Mjzu2J8yerUWLQlOtTBapxmw7foX",
  "https://2k7z3z4g2l.ufs.sh/f/haucGRAjoKMW0VhrOqw2mtRbfAaycNnLMqX6I87dhuQoOEBs",
];

// NAMUNA sharhlar — haqiqiy Google sharhlari bilan almashtiriladi.
const REVIEWS = [
  {
    name: "Emily R.",
    country: "United States",
    rating: 5,
    text: "One of the highlights of our whole trip to Uzbekistan. Our host was so warm and patient — I've never held a needle in my life and still went home with a little piece I'm genuinely proud of. The tea and stories made it feel like visiting family.",
  },
  {
    name: "Thomas B.",
    country: "Germany",
    rating: 5,
    text: "Booked this for my wife and me. Small group, no rush, and you actually learn the real technique rather than just watching. Being in a real workshop in the old town made all the difference.",
  },
  {
    name: "Yuki T.",
    country: "Japan",
    rating: 5,
    text: "Beautiful experience. The colours and patterns have so much meaning behind them, and the master explained everything in clear English. Highly recommend if you love handmade crafts.",
  },
  {
    name: "Camille D.",
    country: "France",
    rating: 5,
    text: "I was worried it might be touristy but it was the opposite — completely authentic and personal. Took my finished embroidery home as the best souvenir from the Silk Road.",
  },
  {
    name: "Sophie & Mark",
    country: "United Kingdom",
    rating: 5,
    text: "Two relaxed hours that flew by. Lovely people, gorgeous textiles everywhere, and we left with a real appreciation for how much work goes into a single Suzani.",
  },
  {
    name: "Anna K.",
    country: "Canada",
    rating: 5,
    text: "A calm, hands-on break from sightseeing. It's rare to spend time with a true master of a craft this old. Worth every minute.",
  },
];

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const title = "Suzani Workshop in Bukhara";
  const description =
    "Join a hands-on Suzani embroidery workshop in Bukhara led by a master artist. A 1–2 hour experience for international visitors — learn traditional Uzbek stitches and take home your own handmade piece.";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(locale, "/workshop") },
    openGraph: {
      title,
      description,
      url: absoluteUrl(locale, "/workshop"),
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
    },
  };
}

export default function WorkshopPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="For International Visitors"
        title="Suzani Workshop in Bukhara"
        description="A hands-on embroidery experience led by a master artist. In 1–2 hours you will learn traditional Uzbek stitches and create your own handmade Suzani piece to take home."
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={bookingUrl("Hello Artsuzani! I would like to book a Suzani workshop in Bukhara. Please share the available dates.")} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-full px-8 h-14 bg-gradient-primary text-white border-none shadow-elegant hover:opacity-90">
              <MessageCircle className="mr-2 h-5 w-5" /> Book via WhatsApp
            </Button>
          </a>
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
            <Clock className="h-4 w-4 text-[var(--theme-accent)]" /> 1–2 hours
            <span className="mx-1">·</span>
            <MapPin className="h-4 w-4 text-[var(--theme-accent)]" /> Bukhara, Uzbekistan
          </div>
        </div>
      </PageHeader>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* 1. Workshop nima */}
        <section className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-5">
            <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)]">
              What is the workshop?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Placeholder description. Explain what the workshop is: an intimate,
              hands-on session in a real Bukhara workshop where guests learn the
              ancient art of Suzani embroidery directly from a master artist. No
              experience needed — everything is provided.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Suitable for solo travellers, couples, and small groups. Sessions
              are run in a relaxed atmosphere with tea and conversation.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-[var(--card-bg)]">
            <Image
              src={HERO_IMAGE}
              alt="Suzani workshop in Bukhara"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>
        </section>

        {/* 2. Dastur (timeline) */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] text-center mb-10">
            The 1–2 hour program
          </h2>
          <div className="space-y-4">
            {PROGRAM.map((p, i) => (
              <div key={i} className="flex gap-3 sm:gap-5 rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-soft">
                <div className="shrink-0 w-20 sm:w-28 pt-1">
                  <span className="inline-block rounded-full bg-[var(--theme-accent)]/10 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[var(--theme-accent)] whitespace-nowrap">
                    {p.time}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)]">{p.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Narx */}
        <section>
          <div className="mx-auto max-w-lg rounded-3xl border border-[var(--border-theme)] bg-[var(--card-bg)] p-8 text-center shadow-elegant">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--theme-accent)]">Price</p>
            <div className="mt-3 flex items-end justify-center gap-2">
              <span className="font-serif text-5xl font-bold text-[var(--price-color)]">
                ${PRICE.amount}
              </span>
              <span className="mb-2 text-[var(--text-secondary)]">/ {PRICE.unit}</span>
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Includes all materials, silk threads, tea, and your handmade piece
              to take home. Group discounts available on request.
            </p>
            <a href={bookingUrl("Hello Artsuzani! I would like to book a Suzani workshop. What are the available dates and group prices?")} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="mt-6 w-full rounded-full h-13 bg-gradient-primary text-white border-none shadow-elegant hover:opacity-90">
                Book your spot
              </Button>
            </a>
          </div>
        </section>

        {/* 4. Nimalar o'rganiladi */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] text-center mb-10">
            What you will learn
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {LEARN.map((l, i) => {
              const Icon = l.icon;
              return (
                <Reveal
                  key={i}
                  delay={i * 80}
                  className="flex gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-shadow hover:shadow-elegant-light"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-accent)]/10">
                    <Icon className="h-6 w-6 text-[var(--theme-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{l.title}</h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{l.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* 5. Master Artist bio — rasm va matn kelgach qo'shiladi */}

        {/* 6. Fotosuratlar */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] text-center mb-10">
            Workshop moments
          </h2>
          {WORKSHOP_PHOTOS.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {WORKSHOP_PHOTOS.map((src, i) => (
                <Reveal
                  key={i}
                  delay={(i % 3) * 90}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-[var(--card-bg)] group/photo"
                >
                  <Image
                    src={src}
                    alt={`Workshop photo ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/photo:scale-105"
                    sizes="(max-width:768px) 50vw, 33vw"
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border bg-[var(--card-bg)] font-serif text-sm text-[var(--text-secondary)]">
                  Photo {i + 1}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. Google Reviews */}
        <section>
          <div className="flex items-center justify-center gap-2 mb-10">
            <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] text-center">
              What guests say
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal
                key={i}
                delay={(i % 3) * 90}
                className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-shadow hover:shadow-elegant-light"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-[var(--theme-accent)] text-[var(--theme-accent)]" />
                  ))}
                </div>
                <p className="flex-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-4 border-t border-border/60 pt-3">
                  <p className="font-semibold text-sm text-[var(--text-primary)]">{r.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{r.country}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 8. For international visitors */}
        <section className="rounded-3xl border border-[var(--border-theme)] bg-[var(--bg-secondary)] p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-[var(--theme-accent)]" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              For international visitors
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-[var(--theme-accent)]" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Location</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">In the historic old town of Bukhara. Exact address shared on booking.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="h-5 w-5 shrink-0 text-[var(--theme-accent)]" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Language</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Conducted in English (and Uzbek/Russian). All levels welcome.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-[var(--theme-accent)]" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Duration</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">1–2 hours, flexible timing to fit your travel schedule.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Yakuniy CTA */}
        <section className="text-center">
          <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-4">
            Ready to create your own Suzani?
          </h2>
          <p className="mx-auto max-w-xl text-[var(--text-secondary)] mb-8">
            Message us on WhatsApp to check availability and book your workshop in Bukhara.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={bookingUrl("Hello Artsuzani! I would like to book a Suzani workshop in Bukhara. Please share the available dates.")} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-8 h-14 bg-gradient-primary text-white border-none shadow-elegant hover:opacity-90">
                <MessageCircle className="mr-2 h-5 w-5" /> Book via WhatsApp
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 border-border">
                Contact us
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
