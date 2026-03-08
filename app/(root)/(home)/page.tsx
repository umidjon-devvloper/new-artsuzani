import { getCategories } from "@/actions/category.actions";
import { getProducts } from "@/actions/product.actions";
import Category from "@/components/shared/category";
import Products from "@/components/shared/products";
import { HeroCarousel } from "@/components/hero-carousel";

export default async function Home() {
  const category = await getCategories();
  const products = await getProducts();

  const productList = Array.isArray((products as any)?.data)
    ? JSON.parse(JSON.stringify((products as any).data.map((p: any) => ({
        ...p,
        href: `/products/${p._id}`,
      }))))
    : [];

  const categoryList =
    "data" in (category as any) ? JSON.parse(JSON.stringify((category as any).data)) : [];

  return (
    <div className=" min-h-screen relative z-0">
      {/* BACKGROUND DECORATIVE SHAPES (Subtle Bukhara Ornaments) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <svg className="absolute top-0 left-0 w-[400px] h-[400px] text-primary/5 sm:w-[600px] sm:h-[600px]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0ZM50 100L100 50L150 100L100 150L50 100Z" />
        </svg>
        <svg className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] text-secondary/10 transform rotate-45" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M100 0C100 55.2285 55.2285 100 0 100C55.2285 100 100 144.772 100 200C100 144.772 144.772 100 200 100C144.772 100 100 55.2285 100 0Z" />
        </svg>
        <svg className="absolute bottom-10 left-[10%] w-64 h-64 text-accent/5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="50" y="0" width="70.7" height="70.7" transform="rotate(45 50 0)" fill="currentColor"/>
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>

      <main className="pt-24 px-4 max-w-screen-2xl w-full mx-auto relative z-10">
        <section aria-labelledby="hero" className="mb-16 z-10">
          <h1 id="hero" className="sr-only">
            Explore Authentic Uzbek Suzani
          </h1>
          <div className="w-full overflow-hidden">
            {/* Naqsh ustida ko'tarilgan effekt */}
            <HeroCarousel className="rounded-[32px] shadow-2xl/50 ring-1 ring-white/20 backdrop-blur-sm" />
          </div>
        </section>

        {/* CATEGORIES */}
        <section
          aria-labelledby="categories-heading"
          className="mb-16 relative z-10 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300"
        >
          <div className="flex items-center justify-between mb-8">
            <h2
              id="categories-heading"
              className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wide"
            >
              Explore Authenticity
            </h2>
            <div className="h-px bg-border flex-1 ml-6 hidden sm:block"></div>
          </div>
          <Category category={categoryList} />
        </section>

        {/* PRODUCTS */}
        <section
          id="products"
          aria-labelledby="products-heading"
          className="mb-20 relative z-10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500"
        >
          <div className="flex items-center justify-between mb-12">
            <h2
              id="products-heading"
              className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wide"
            >
              Curated Masterpieces
            </h2>
            <div className="h-px bg-border flex-1 ml-6 hidden sm:block"></div>
          </div>
          <Products products={productList} currency="USD" />
        </section>
      </main>
    </div>
  );
}
