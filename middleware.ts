import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/admin(.*)",
  "/:locale/profile(.*)",
]);

// Bu route'lar Clerk'dan o'tadi, lekin next-intl ularga locale prefiksi
// qo'shmasligi kerak — aks holda /api/search -> /en/api/search -> 404 bo'ladi.
const skipIntl = createRouteMatcher(["/api(.*)", "/trpc(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (skipIntl(req)) return;

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Statik fayllar va metadata route'lari (robots.txt, sitemap.xml) chetlab o'tiladi
    "/((?!_next|_vercel|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|txt|xml|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
