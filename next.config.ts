import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // `unoptimized: true` olib tashlandi — rasmlar endi CDN URL'lari, ya'ni
    // Next ularni AVIF/WebP ga o'girib, kerakli o'lchamda bera oladi.
    formats: ["image/avif", "image/webp"],
    // Optimizatsiya qilingan rasm 30 kun brauzer/CDN keshida qoladi
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Avval `hostname: "**"` edi — ya'ni istalgan sayt rasmini
    // sizning optimizatsiya kvotangiz hisobidan uzatish mumkin edi.
    remotePatterns: [
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
    ],
  },
  // Xavfsizlik header'lari (Lighthouse "Best Practices"): clickjacking, HSTS,
  // MIME-sniffing va referrer siyosati. CSP Clerk bilan murakkab — qo'shilmadi.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
