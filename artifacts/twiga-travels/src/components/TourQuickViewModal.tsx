import { useState, useEffect } from 'react'
import { useUI } from '@/context/ui-context'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useGetTourBySlug,
  getGetTourBySlugQueryKey,
} from '@workspace/api-client-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Users, Check, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'wouter'

export function TourQuickViewModal() {
  const { quickViewSlug, closeQuickView, openBooking } = useUI()
  const [imageIdx, setImageIdx] = useState(0)

  // Reset gallery index whenever a new tour is opened
  useEffect(() => {
    setImageIdx(0)
  }, [quickViewSlug])

  const { data: tour, isLoading } = useGetTourBySlug(quickViewSlug ?? '', {
    query: {
      enabled: !!quickViewSlug,
      queryKey: getGetTourBySlugQueryKey(quickViewSlug ?? ''),
    },
  })

  const handleClose = () => {
    closeQuickView()
    setImageIdx(0)
  }

  const handleBook = () => {
    if (!tour) return
    handleClose()
    openBooking(tour.id, tour.title)
  }

  return (
    <Dialog open={!!quickViewSlug} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">
          {tour?.title ?? 'Tour Details'}
        </DialogTitle>

        <AnimatePresence mode="wait">
          {isLoading || !tour ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 flex items-center justify-center"
            >
              <div className="space-y-3 w-full max-w-xs mx-auto">
                <div className="h-6 bg-muted rounded-full animate-pulse w-3/4 mx-auto" />
                <div className="h-4 bg-muted rounded-full animate-pulse w-1/2 mx-auto" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2"
            >
              {/* ── Gallery ── */}
              <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[220px] bg-muted overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imageIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={tour.gallery_urls?.[imageIdx] ?? ''}
                    alt={tour.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Dot navigation */}
                {tour.gallery_urls && tour.gallery_urls.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {tour.gallery_urls.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImageIdx(i)}
                        aria-label={`View image ${i + 1}`}
                        className={[
                          'w-2 h-2 rounded-full transition-all duration-200',
                          i === imageIdx
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/80',
                        ].join(' ')}
                      />
                    ))}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                  {tour.is_featured && (
                    <Badge className="bg-primary/90 text-xs shadow-sm">Featured</Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white border-0 text-xs backdrop-blur-sm"
                  >
                    {tour.activity_type}
                  </Badge>
                </div>
              </div>

              {/* ── Info ── */}
              <div className="flex flex-col p-6 overflow-y-auto max-h-[540px]">
                <h2 className="font-serif text-2xl font-bold mb-3 leading-tight">
                  {tour.title}
                </h2>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-primary" />
                    {tour.destination}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-primary" />
                    {tour.duration_days} Days
                  </span>
                  {tour.max_group_size && (
                    <span className="flex items-center gap-1.5">
                      <Users size={13} className="text-primary" />
                      Max {tour.max_group_size}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-shrink-0">
                  {tour.summary}
                </p>

                {/* Inclusions preview */}
                {tour.inclusions.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                      What's included
                    </p>
                    <ul className="space-y-2">
                      {tour.inclusions.slice(0, 4).map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check
                            size={13}
                            className="text-primary mt-0.5 shrink-0"
                          />
                          <span>{inc}</span>
                        </li>
                      ))}
                      {tour.inclusions.length > 4 && (
                        <li className="text-xs text-muted-foreground pl-5">
                          +{tour.inclusions.length - 4} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Price + CTAs */}
                <div className="mt-auto pt-4 border-t space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-muted-foreground">From</span>
                    <span className="text-3xl font-serif font-bold text-primary">
                      ${tour.price_from}
                    </span>
                    <span className="text-xs text-muted-foreground">/ person</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={handleBook} className="rounded-full">
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full gap-1"
                      asChild
                    >
                      <Link href={`/tours/${tour.slug}`} onClick={handleClose}>
                        Full Details <ArrowRight size={13} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
