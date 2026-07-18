import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MapPin, CalendarDays, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useListDestinations } from '@workspace/api-client-react'
import heroSavanna from '@/assets/hero-savanna.jpg'
import heroCoastal from '@/assets/hero-coastal.jpg'
import heroHighlands from '@/assets/hero-highlands.jpg'

const SLIDES = [
  {
    image: heroSavanna,
    headline: 'Discover the Soul of Africa',
    sub: 'Premium safaris, coastal escapes, and highland adventures across East Africa.',
  },
  {
    image: heroCoastal,
    headline: 'Where the Ocean Meets Paradise',
    sub: "Pristine beaches and turquoise waters await on Kenya's stunning coastline.",
  },
  {
    image: heroHighlands,
    headline: 'Adventure Beyond the Horizon',
    sub: 'Trek through ancient forests and soar above the clouds on Mount Kenya.',
  },
]

export function HeroSection() {
  const [, navigate] = useLocation()
  const [active, setActive] = useState(0)
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [travelers, setTravelers] = useState(2)

  const { data: destinations = [] } = useListDestinations()

  const next = useCallback(() => setActive(a => (a + 1) % SLIDES.length), [])
  const prev = useCallback(() => setActive(a => (a - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (date) params.set('date', date)
    if (travelers > 1) params.set('travelers', String(travelers))
    navigate(`/tours${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <img
            src={SLIDES[active].image}
            alt=""
            aria-hidden
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

      {/* Slide arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hidden md:flex"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hidden md:flex"
      >
        <ChevronRight size={18} />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-[220px] md:bottom-[260px] left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-400 ${i === active ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/70'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8"
          >
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/70 mb-4">
              Premium East African Experiences
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-5 max-w-4xl">
              {SLIDES[active].headline}
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              {SLIDES[active].sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3 mb-10"
        >
          <Button
            size="lg"
            className="rounded-full h-12 px-7 text-base shadow-2xl hover:shadow-primary/30 transition-all"
            onClick={() => navigate('/tours')}
          >
            Explore Tours
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-12 px-7 text-base bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all"
            onClick={() => navigate('/contact')}
          >
            Plan My Trip
          </Button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
              {/* Destination */}
              <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 transition-colors col-span-1">
                <MapPin size={16} className="text-white/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-0.5">
                    Destination
                  </p>
                  <select
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="bg-transparent text-white text-sm w-full outline-none appearance-none cursor-pointer placeholder-white/40"
                    aria-label="Select destination"
                  >
                    <option value="" className="text-black">Any destination</option>
                    {destinations.map(d => (
                      <option key={d.name} value={d.name} className="text-black">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 transition-colors">
                <CalendarDays size={16} className="text-white/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-0.5">
                    Travel Date
                  </p>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="bg-transparent text-white text-sm w-full outline-none cursor-pointer [color-scheme:dark]"
                    aria-label="Select travel date"
                  />
                </div>
              </div>

              {/* Travelers */}
              <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 transition-colors">
                <Users size={16} className="text-white/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-0.5">
                    Travelers
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTravelers(t => Math.max(1, t - 1))}
                      aria-label="Decrease travelers"
                      className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white text-sm font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white text-sm font-medium min-w-[20px] text-center">
                      {travelers}
                    </span>
                    <button
                      onClick={() => setTravelers(t => Math.min(20, t + 1))}
                      aria-label="Increase travelers"
                      className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white text-sm font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Search button */}
              <Button
                size="lg"
                className="rounded-xl h-full min-h-[60px] gap-2 text-base shadow-lg sm:rounded-xl"
                onClick={handleSearch}
              >
                <Search size={18} />
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
