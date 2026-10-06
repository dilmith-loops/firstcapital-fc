import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { AdminStore, TestimonialItem, DEFAULT_TESTIMONIALS } from "@/lib/admin-store";

export function TestimonialSlider() {
  const [items, setItems] = useState<TestimonialItem[]>(() => {
    const list = AdminStore.getTestimonials();
    const active = list.filter((t) => t.status === "Active");
    return active.length > 0 ? active : DEFAULT_TESTIMONIALS;
  });
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Initial fetch from DB
    AdminStore.fetchTestimonialsFromDb().then((list) => {
      const activeList = list.filter((t) => t.status === "Active");
      if (activeList.length > 0) {
        setItems(activeList);
      }
    });

    const unsubscribe = AdminStore.subscribe(() => {
      const list = AdminStore.getTestimonials();
      const activeList = list.filter((t) => t.status === "Active");
      setItems(activeList.length > 0 ? activeList : DEFAULT_TESTIMONIALS);
    });

    return unsubscribe;
  }, []);

  // Safe active index check
  useEffect(() => {
    if (active >= items.length) {
      setActive(0);
    }
  }, [items.length, active]);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [items.length]);

  const go = (step: number) => {
    if (items.length === 0) return;
    setActive((i) => (i + step + items.length) % items.length);
  };

  const currentTestimonials = items.length > 0 ? items : DEFAULT_TESTIMONIALS;

  return (
    <section aria-label="What our investors say" className="testimonial-slider px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-xs font-extrabold uppercase text-muted-foreground">What our investors say</p>
        <div className="grid gap-6 lg:grid-cols-[0.65fr_1fr] lg:items-end">
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">Real People.<br />Real Starting Points.</h2>
          {currentTestimonials.length > 1 && (
            <div className="flex items-center gap-3 lg:justify-self-end">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => go(-1)}
                className="slider-nav inline-flex size-11 items-center justify-center border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => go(1)}
                className="slider-nav inline-flex size-11 items-center justify-center border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        <div className="slider-frame mt-10 overflow-hidden border border-border bg-card">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {currentTestimonials.map((t, idx) => (
              <figure
                key={t.id || idx}
                className="w-full shrink-0 p-8 sm:p-12"
                aria-hidden={idx !== active}
              >
                <div className="flex items-center justify-between gap-4">
                  <Quote className="size-8 text-primary" />
                  {t.rating && t.rating > 0 && (
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
                <blockquote className="mt-6 max-w-3xl text-xl font-bold leading-8 sm:text-2xl sm:leading-9">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-extrabold">{t.name}</span>
                  <span className="text-muted-foreground"> — {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {currentTestimonials.length > 1 && (
          <div className="mt-5 flex gap-2">
            {currentTestimonials.map((t, i) => (
              <button
                key={t.id || i}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={`slider-dot h-2.5 w-8 border border-border cursor-pointer transition-colors ${
                  i === active ? "bg-primary" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
