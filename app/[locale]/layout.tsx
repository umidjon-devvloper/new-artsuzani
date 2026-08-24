import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Whatsapp from "@/components/shared/whatsapp";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { Cinzel, Montserrat } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  ru: "ru_RU",
  uz: "uz_UZ",
  tr: "tr_TR",
  fr: "fr_FR",
};

const DESCRIPTION =
  "Discover exquisite, luxury handmade Suzani embroidery from Bukhara, Uzbekistan. Shop unique, traditional vintage designs crafted with authentic passion.";

// `metadata` o'rniga `generateMetadata`: canonical, hreflang va og:locale
// joriy tilga bog'liq bo'lishi kerak (avval hammasi uz_UZ deb qotib qolgan edi).
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Artsuzani - Premium Handmade Suzani Embroidery",
      template: "%s | Artsuzani",
    },
    description: DESCRIPTION,
    applicationName: "Artsuzani",
    referrer: "origin-when-cross-origin",
    keywords: [
      "artsuzani",
      "suzani",
      "handmade",
      "embroidery",
      "uzbek",
      "bukhara",
      "premium textiles",
      "vintage decor",
    ],
    authors: [{ name: "Artsuzani" }],
    creator: "Artsuzani",
    publisher: "Artsuzani",
    alternates: {
      canonical: absoluteUrl(locale),
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, absoluteUrl(l)])
      ),
    },
    openGraph: {
      title: "Artsuzani - Premium Handmade Suzani Embroidery",
      description: DESCRIPTION,
      type: "website",
      url: absoluteUrl(locale),
      locale: OG_LOCALE[locale] ?? "en_US",
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
      countryName: "Uzbekistan",
      siteName: "Artsuzani",
    },
    icons: {
      icon: [
        { url: "/logo.png", type: "image/png", sizes: "96x96" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    verification: {
      google: "mYl6TcJAb1dNHwCa1VFTFD0kKZS9L8dpQOO8VjzRON0",
    },
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Google uchun tuzilmali ma'lumot (Organization + WebSite).
  // Brend nomi, logo va qidiruv qutisi izohlanadi — qidiruv natijalarida
  // boyroq ko'rinish (rich results) beradi.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Artsuzani",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: DESCRIPTION,
        sameAs: [] as string[],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Artsuzani",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: locale,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/${locale}/products?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${montserrat.className} ${cinzel.variable} ${montserrat.variable} antialiased`}
          suppressHydrationWarning
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <NextIntlClientProvider messages={messages}>
            <NextTopLoader
              color="#D4AF37"
              initialPosition={0.5}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #D4AF37,0 0 5px #D4AF37"
            />
            {children}
            <Toaster />
            <div className="relative z-50">
              <Whatsapp />
            </div>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
