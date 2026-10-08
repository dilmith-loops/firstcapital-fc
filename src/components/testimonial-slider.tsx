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
    <section aria-label="What our customers say" className="testimonial-slider px-5 py-16 sm:px-8 lg:px-12 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#f1ca1f]/20 text-[#1a214c] text-xs font-extrabold uppercase tracking-wider mb-2.5">
              Testimonials
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1a214c] sm:text-4xl lg:text-5xl">
              What our customers say
            </h2>
          </div>
          {currentTestimonials.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => go(-1)}
                className="slider-nav inline-flex size-10 items-center justify-center rounded-lg border border-[#1a214c]/20 bg-white text-[#1a214c] hover:bg-[#1a214c] hover:text-[#f1ca1f] transition-all cursor-pointer shadow-xs"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => go(1)}
                className="slider-nav inline-flex size-10 items-center justify-center rounded-lg border border-[#1a214c]/20 bg-white text-[#1a214c] hover:bg-[#1a214c] hover:text-[#f1ca1f] transition-all cursor-pointer shadow-xs"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        <div
          className="slider-frame mt-8 overflow-hidden rounded-2xl border border-[#1a214c] bg-[#1a214c] text-[#f1ca1f] shadow-lg"
          style={{ backgroundColor: "#1a214c", color: "#f1ca1f", borderColor: "#1a214c" }}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {currentTestimonials.map((t, idx) => (
              <figure
                key={t.id || idx}
                className="w-full shrink-0 p-6 sm:p-10"
                aria-hidden={idx !== active}
                style={{ backgroundColor: "#1a214c", color: "#f1ca1f" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="size-10 rounded-xl bg-[#f1ca1f] flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: "#f1ca1f" }}
                  >
                    <Quote className="size-5 text-[#1a214c] fill-[#1a214c]" style={{ color: "#1a214c", fill: "#1a214c" }} />
                  </div>
                  {t.rating && t.rating > 0 && (
                    <div className="flex items-center gap-1 text-[#f1ca1f]" style={{ color: "#f1ca1f" }}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-[#f1ca1f] text-[#f1ca1f]" style={{ color: "#f1ca1f", fill: "#f1ca1f" }} />
                      ))}
                    </div>
                  )}
                </div>
                <blockquote
                  className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-[#f1ca1f] sm:text-xl sm:leading-8"
                  style={{ color: "#f1ca1f" }}
                >
                  “{t.quote}”
                </blockquote>
                <figcaption
                  className="mt-5 text-sm border-t border-[#f1ca1f]/30 pt-4 flex items-center gap-2"
                  style={{ borderColor: "rgba(241, 202, 31, 0.3)" }}
                >
                  <span className="font-extrabold text-[#f1ca1f]" style={{ color: "#f1ca1f" }}>{t.name}</span>
                  <span className="text-[#f1ca1f]/80 font-medium" style={{ color: "rgba(241, 202, 31, 0.85)" }}>— {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {currentTestimonials.length > 1 && (
          <div className="mt-4 flex gap-2">
            {currentTestimonials.map((t, i) => (
              <button
                key={t.id || i}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                style={{ backgroundColor: i === active ? "#1a214c" : "#cbd5e1" }}
                className={`slider-dot h-2 rounded-full cursor-pointer transition-all ${
                  i === active ? "bg-[#1a214c] w-10" : "bg-slate-300 hover:bg-slate-400 w-7"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
