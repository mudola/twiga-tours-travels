import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MapPin, Clock, Users, Star, Check, X as XIcon,
  Calendar, ChevronLeft, ChevronRight, ArrowRight,
} from 'lucide-react'
import { useUI } from '@/context/ui-context'
import { type Tour } from '@workspace/api-client-react'

// Generate 6 upcoming dates spaced 2 weeks apart
function getAvailableDates(): string[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + (i + 1) * 14)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  })
}

const DATES = getAvailableDates()

interface Props {
  tour: Tour | null
  onClose: () => void
}

export function TourReadMoreModal({ tour, onClose }: Props) {
  const { openBooking } = useUI()
  const [imgIdx, setImgIdx] = useState(0)

  const images = tour?.gallery_urls ?? []

  const handleBook = () => {
    onClose()
    if (tour) openBooking(tour.id, tour.title)
  }

  // Reset image index when tour changes
  // (handled by keying the dialog content on tour.id)

  return (
    <Dialog open={!!tour} onOpenChange={open => !open && onClose()}>
      <DialogContent
        key={tour?.id}
        className="max-w-5xl w-full h-[92vh] p-0 gap-0 overflow-hidden flex flex-col"
      >
        <DialogTitle className="sr-only">{tour?.title ?? 'Tour Details'}</DialogTitle>

        {tour && (
          <>
            {/* ─── Sticky header ───────────────────────────────── */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur z-20">
              <div className="min-w-0 mr-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                  {tour.destination} · {tour.activity_type}
                </p>
                <h2 className="font-serif text-lg md:text-xl font-bold leading-tight line-clamp-1">
                  {tour.title}
                </h2>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-xl font-serif font-bold text-primary">${tour.price_from}</p>
                </div>
                <Button onClick={handleBook} className="rounded-full hidden sm:flex">
                  Book Now
                </Button>
              </div>
            </div>

            {/* ─── Scrollable body ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">

              {/* Gallery */}
              <div className="relative aspect-video bg-black w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIdx}
                    src={images[imgIdx] ?? ''}
                    alt={`${tour.title} — image ${imgIdx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-sm flex items-center justify-center text-white transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setImgIdx(i => (i + 1) % images.length)}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-sm flex items-center justify-center text-white transition"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          i === imgIdx ? 'bg-white w-6' : 'bg-white/50 w-2.5 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="absolute bottom-0 inset-x-0 flex gap-2 p-3 bg-gradient-to-t from-black/60 to-transparent justify-end pr-4 pb-10">
                    {images.slice(0, 5).map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-12 h-9 rounded overflow-hidden border-2 transition-all ${
                          i === imgIdx ? 'border-white scale-105' : 'border-transparent opacity-60 hover:opacity-90'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {images.length > 5 && (
                      <div className="w-12 h-9 rounded overflow-hidden bg-black/50 flex items-center justify-center text-white text-xs font-medium border border-white/20">
                        +{images.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stats bar */}
              <div className="flex flex-wrap gap-6 px-6 md:px-8 py-5 border-b bg-card">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={15} className="text-primary" />
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-semibold ml-1">{tour.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={15} className="text-primary" />
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold ml-1">{tour.duration_days} Days</span>
                </div>
                {tour.max_group_size && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={15} className="text-primary" />
                    <span className="text-muted-foreground">Group Size</span>
                    <span className="font-semibold ml-1">Max {tour.max_group_size}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm">
                  {[1,2,3,4,5].map(n => (
                    <Star
                      key={n}
                      size={13}
                      className={n <= 5 ? 'fill-amber-400 text-amber-400' : 'text-border'}
                    />
                  ))}
                  <span className="font-semibold ml-0.5">5.0</span>
                  <span className="text-muted-foreground">(48 reviews)</span>
                </div>
              </div>

              {/* Main content */}
              <div className="px-6 md:px-8 py-8 space-y-10">

                {/* Description */}
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tour.summary}
                  </p>
                </div>

                {/* Itinerary */}
                {tour.itinerary.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-4">Day-by-Day Itinerary</h3>
                    <Accordion type="multiple" className="space-y-2">
                      {tour.itinerary.map((day) => (
                        <AccordionItem
                          key={day.day}
                          value={`day-${day.day}`}
                          className="border rounded-xl px-1 overflow-hidden"
                        >
                          <AccordionTrigger className="hover:no-underline px-4 py-4">
                            <div className="flex items-center gap-4 text-left">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                                D{day.day}
                              </div>
                              <span className="font-semibold">{day.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-5 pt-1 ml-14">
                            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                              {day.description}
                            </p>
                            {(day.accommodation || day.meals) && (
                              <div className="flex flex-wrap gap-4 text-sm bg-muted/50 rounded-lg px-4 py-3">
                                {day.accommodation && (
                                  <span>
                                    <strong className="text-foreground">Stay: </strong>
                                    <span className="text-muted-foreground">{day.accommodation}</span>
                                  </span>
                                )}
                                {day.meals && (
                                  <span>
                                    <strong className="text-foreground">Meals: </strong>
                                    <span className="text-muted-foreground">{day.meals}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Includes / Excludes */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Included */}
                  {tour.inclusions.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-xl p-5">
                      <h4 className="font-semibold mb-4 flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Check size={16} /> What's Included
                      </h4>
                      <ul className="space-y-2.5">
                        {tour.inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <Check size={13} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Excluded */}
                  {tour.exclusions.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl p-5">
                      <h4 className="font-semibold mb-4 flex items-center gap-2 text-red-700 dark:text-red-400">
                        <XIcon size={16} /> What's Not Included
                      </h4>
                      <ul className="space-y-2.5">
                        {tour.exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <XIcon size={13} className="text-red-500 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Available Dates */}
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-primary" /> Available Dates
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {DATES.map((d, i) => (
                      <button
                        key={i}
                        className="px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 text-sm font-medium transition-all duration-200"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    * Departures run every 2 weeks. Contact us for custom dates.
                  </p>
                </div>

                {/* Map placeholder */}
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" /> Location
                  </h3>
                  <div className="h-52 rounded-xl bg-muted border overflow-hidden flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div
                      className="text-center"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, hsl(var(--primary)/0.15) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.5,
                      }}
                    />
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3">
                        <MapPin className="text-primary w-6 h-6" />
                      </div>
                      <p className="font-semibold text-foreground">{tour.destination}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Interactive map coming soon
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                {images.length > 1 && (
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-4">Photo Gallery</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {images.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={`aspect-square rounded-lg overflow-hidden transition-all ${
                            i === imgIdx ? 'ring-2 ring-primary ring-offset-1' : 'hover:opacity-85'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Gallery ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom spacer */}
                <div className="h-4" />
              </div>
            </div>

            {/* ─── Sticky bottom CTA ────────────────────────────── */}
            <div className="shrink-0 border-t bg-background/95 backdrop-blur px-6 py-4">
              <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
                <div>
                  <p className="text-xs text-muted-foreground">Starting from</p>
                  <p className="text-2xl font-serif font-bold text-primary">
                    ${tour.price_from}
                    <span className="text-sm font-normal text-muted-foreground ml-1">/ person</span>
                  </p>
                </div>
                <Button
                  size="lg"
                  className="rounded-full flex-1 max-w-xs gap-2 shadow-lg"
                  onClick={handleBook}
                >
                  Book This Tour <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
