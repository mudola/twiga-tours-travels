import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    country: 'United Kingdom',
    initials: 'SM',
    gradient: 'from-orange-400 to-rose-500',
    rating: 5,
    tour: 'Maasai Mara Migration Safari',
    review:
      "Absolutely breathtaking. The wildebeest migration was unlike anything I've ever witnessed. Our guide's depth of knowledge and genuine passion made every single moment feel special. Worth every penny and more.",
  },
  {
    name: 'James Okonkwo',
    country: 'Nigeria',
    initials: 'JO',
    gradient: 'from-emerald-400 to-teal-600',
    rating: 5,
    tour: 'Amboseli Elephant Experience',
    review:
      "An unforgettable family adventure. The children were completely mesmerised watching elephants move against the backdrop of Kilimanjaro. Twiga's team handled every detail flawlessly — we didn't have to think about a thing.",
  },
  {
    name: 'Elena Fontaine',
    country: 'France',
    initials: 'EF',
    gradient: 'from-violet-400 to-purple-600',
    rating: 5,
    tour: 'Diani Beach Coastal Escape',
    review:
      "The perfect honeymoon destination. Crystal-clear water, pristine beaches, and the most luxurious accommodation I've ever stayed in. The private sunset dhow cruise was pure magic — I still think about it every day.",
  },
  {
    name: 'Thomas Weber',
    country: 'Germany',
    initials: 'TW',
    gradient: 'from-blue-400 to-cyan-600',
    rating: 5,
    tour: 'Lake Nakuru Flamingo Safari',
    review:
      "As a wildlife photographer I've travelled across six continents. Kenya with Twiga was the finest safari experience I've ever had — bar none. The flamingo lake in the evening light is simply extraordinary.",
  },
  {
    name: 'Priya Sharma',
    country: 'India',
    initials: 'PS',
    gradient: 'from-amber-400 to-orange-500',
    rating: 5,
    tour: 'Mount Kenya Highland Trek',
    review:
      'Challenging and absolutely exhilarating. The support team was outstanding every step of the way, the scenery was otherworldly, and the sense of achievement at the summit is something I will carry with me forever.',
  },
  {
    name: 'Marco Ricci',
    country: 'Italy',
    initials: 'MR',
    gradient: 'from-rose-400 to-pink-600',
    rating: 5,
    tour: 'Samburu Wilderness Safari',
    review:
      'I came for the scenery and left transformed. The Samburu people and their culture, the remote landscapes, the rare Northern Special Five — it was unlike anything on offer elsewhere. Twiga exceeded every expectation.',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? 'fill-amber-400 text-amber-400' : 'text-border'}
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  const [active, setActive] = useState(0)
  const total = TESTIMONIALS.length

  const prev = useCallback(() => setActive(a => (a - 1 + total) % total), [total])
  const next = useCallback(() => setActive(a => (a + 1) % total), [total])

  useEffect(() => {
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [next])

  const t = TESTIMONIALS[active]

  return (
    <section className="py-24 md:py-32 bg-muted/40 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Traveller Stories
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
            What Our Guests Say
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          {/* Quote card */}
          <div className="relative min-h-[320px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.38, ease: 'easeOut' }}
                className="w-full bg-card border rounded-3xl p-8 md:p-12 shadow-xl"
              >
                {/* Quote icon */}
                <Quote
                  className="text-primary/20 mb-6 w-10 h-10"
                  strokeWidth={1.5}
                />

                {/* Review text */}
                <blockquote className="text-lg md:text-xl text-foreground font-medium leading-relaxed mb-8 font-serif italic">
                  "{t.review}"
                </blockquote>

                {/* Footer */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md`}
                  >
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.country}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Travelled: {t.tour}
                    </p>
                  </div>
                  <div className="hidden sm:block shrink-0">
                    <Stars count={t.rating} />
                    <p className="text-xs text-muted-foreground mt-1 text-right">Verified guest</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Prev */}
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border bg-card hover:bg-muted flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? 'bg-primary w-8' : 'bg-border w-2 hover:bg-primary/40'
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border bg-card hover:bg-muted flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Avatars row */}
        <div className="flex justify-center mt-10 gap-3">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              aria-label={`Read ${t.name}'s review`}
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${
                i === active
                  ? 'scale-125 ring-2 ring-primary ring-offset-2'
                  : 'opacity-50 hover:opacity-80 hover:scale-110'
              }`}
            >
              {t.initials}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
