import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

/**
 * Maxsus 404 sahifasi. notFound() chaqirilganda yoki mavjud bo'lmagan
 * manzilga kirilganda ko'rinadi — standart Next 404 o'rniga saytga mos dizayn.
 */
export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-serif text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
        404
      </p>
      <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
        Sahifa topilmadi
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Siz izlagan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi
        mumkin. Quyidagi havolalar orqali davom eting.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button
            size="lg"
            className="rounded-full px-8 bg-gradient-primary text-white border-none shadow-elegant hover:opacity-90"
          >
            Bosh sahifa
          </Button>
        </Link>
        <Link href="/products">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-border"
          >
            Mahsulotlar
          </Button>
        </Link>
      </div>
    </div>
  );
}
