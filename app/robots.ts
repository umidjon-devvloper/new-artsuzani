export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/profile"],
    },
    sitemap: "https://artsuzani.com/sitemap.xml",
  };
}
