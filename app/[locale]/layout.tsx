import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Whatsapp from "@/components/shared/whatsapp";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { Cinzel, Montserrat } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

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

export const metadata: Metadata = {
  metadataBase: new URL("https://artsuzani.com"),
  title: {
    default: "Artsuzani - Premium Handmade Suzani Embroidery",
    template: "%s | Artsuzani"
  },
  description: "Discover exquisite, luxury handmade Suzani embroidery from Bukhara, Uzbekistan. Shop unique, traditional vintage designs crafted with authentic passion.",
  applicationName: "Artsuzani",
  referrer: "origin-when-cross-origin",
  keywords: ["artsuzani", "suzani", "handmade", "embroidery", "uzbek", "bukhara", "premium textiles", "vintage decor"],
  authors: [{ name: "Artsuzani" }],
  creator: "Artsuzani",
  publisher: "Artsuzani",
  openGraph: {
    title: "Artsuzani - Premium Handmade Suzani Embroidery",
    description:
      "Discover exquisite, luxury handmade Suzani embroidery from Bukhara, Uzbekistan. Shop unique, traditional vintage designs crafted with authentic passion.",
    type: "website",
    url: "https://artsuzani.com",
    locale: "uz_UZ",
    images:
      "https://9onczztehf.ufs.sh/f/lneKO3fyzBmDh65vxdm22nFCasfAVwB3vicE98dJYzL70xgQ",
    countryName: "Uzbekistan",
    siteName: "Artsuzani",
  },
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.png", type: "image/png", sizes: "96x96" },
      { url: "/logo.png", type: "image/svg+xml" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180" }],
  },
};

export default async function LocaleLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <meta name="google-site-verification" content="mYl6TcJAb1dNHwCa1VFTFD0kKZS9L8dpQOO8VjzRON0" />
        <link
          rel="icon"
          type="image/png"
          href="/logo.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/logo.png"
        />
        <body className={`${montserrat.className} ${cinzel.variable} ${montserrat.variable} antialiased`} suppressHydrationWarning>
          <NextIntlClientProvider messages={messages}>
            <NextTopLoader
              color="#3182CE"
              initialPosition={0.5}
              crawlSpeed={200}
              height={2}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #3182CE,0 0 5px #3182CE"
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
