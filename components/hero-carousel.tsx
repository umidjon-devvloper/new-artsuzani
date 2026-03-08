"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface HeroCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  heightClass?: string; // e.g. "h-[60vh] min-h-[360px] max-h-[680px]"
  autoplayMs?: number; // default 4500
}

const slides = [
  {
    src: "/artsuzani.jpg",
    alt: "Vintage Suzani embroidery detail",
    caption: "Vintage Suzani — handworked heritage",
  },
{
    src: "https://0evi7lr5v8.ufs.sh/f/LN78d9BJu8Qki9XTfbyAmpNgbM2oFeT1E0tjuwd7x6vh8kRI",
    alt: "Bukhara bazaar with textiles",
    caption: "From the bazaars of Bukhara",
  },
  {
    src: "https://0evi7lr5v8.ufs.sh/f/LN78d9BJu8QkNABTT79Cy1nRQeTGtbLOwEMIa278FAVPXWdz",
    alt: "Hand stitching on Suzani textile",
    caption: "Hand stitching — every thread matters",
  },
];

export function HeroCarousel({
  className,
  heightClass = "h-[52vh] min-h-[460px] max-h-[560px]",
  autoplayMs = 4500,
  ...props
}: HeroCarouselProps) {
  const pluginRef = React.useRef(
    Autoplay({
      delay: autoplayMs,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      duration: 24, // ms per px-ish (smooth)
      dragFree: false,
    },
    [pluginRef.current]
  );

  const [index, setIndex] = React.useState(0);
  const [isHover, setIsHover] = React.useState(false);

  // Sync selected index
  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Hover → pause / resume
  React.useEffect(() => {
    if (!emblaApi) return;
    const autoplay = pluginRef.current;
    if (isHover) autoplay.stop();
    else autoplay.play();
  }, [isHover, emblaApi]);

  const scrollPrev = React.useCallback(
    () => emblaApi?.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = React.useCallback(
    () => emblaApi?.scrollNext(),
    [emblaApi]
  );
  const scrollTo = React.useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...props}
    >
      {/* Top progress bar */}
      <div className="absolute left-0 right-0 top-0 z-30 h-1 bg-black/10 dark:bg-white/10">
        <motion.div
          key={`${index}-${isHover}-${autoplayMs}`}
          initial={{ width: 0 }}
          animate={{ width: isHover ? 0 : "100%" }}
          transition={{
            duration: isHover ? 0 : autoplayMs / 1000,
            ease: "linear",
          }}
          className="h-full bg-white/70 dark:bg-white/80 backdrop-blur-[1px]"
        />
      </div>

      {/* Embla viewport */}
      <div className={cn("relative", heightClass)}>
        <div className="embla overflow-hidden h-full" ref={emblaRef}>
          <div className="embla__container flex h-full">
            {slides.map((s, i) => (
              <div
                className="embla__slide relative min-w-0 flex-[0_0_100%] h-full"
                key={s.src}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    sizes="(max-width: 768px) 100vw,
         (max-width: 1280px) 90vw,
         1200px"
                    className="object-cover"
                  />

                  {/* Darker gradient overlay at bottom for text contrast only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                  {/* Caption */}
                  <AnimatePresence mode="popLayout">
                    {s.caption && index === i && (
                      <motion.div
                        key={`cap-${i}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 max-w-[92%] sm:max-w-[70%]"
                      >
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-black/25 backdrop-blur-md px-4 py-2 text-sm sm:text-base font-medium text-white shadow-lg ring-1 ring-white/30">
                          {s.caption}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev/Next */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous slide"
          className={cn(
            "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-11 w-11 sm:h-12 sm:w-12 rounded-full z-30",
            "bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50",
            "border border-border/60 shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          )}
        >
          <span className="sr-only">Previous</span>
          <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5">
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next slide"
          className={cn(
            "absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-11 w-11 sm:h-12 sm:w-12 rounded-full z-30",
            "bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50",
            "border border-border/60 shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          )}
        >
          <span className="sr-only">Next</span>
          <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5">
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                active ? "w-6 bg-white/90" : "bg-white/50 hover:bg-white/80"
              )}
            />
          );
        })}
      </div>

      {/* Slide counter chip */}
      <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 z-30">
        <div className="select-none rounded-full bg-black/35 text-white text-xs px-2.5 py-1.5 backdrop-blur ring-1 ring-white/25">
          {index + 1} / {slides.length}
        </div>
      </div>

      {/* Soft decorative glow */}
      <div className="pointer-events-none absolute -inset-x-10 -bottom-24 h-48 blur-3xl opacity-30 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40" />
    </div>
  );
}
