import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { useGetFeaturedTours } from '@workspace/api-client-react'
import { type Tour } from '@workspace/api-client-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Star, Users, ArrowRight, Compass } from 'lucide-react'
import { TourReadMoreModal } from './TourReadMoreModal'
import { useUI } from '@/context/ui-context'

function StarRating({ score = 5 }: { score?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={12}
          className={n <= Math.round(score) ? 'fill-amber-400 text-amber-400' : 'text-border'}
        />
      ))}
      <span className="ml-1.5 text-xs text-muted-foreground font-medium">{score.toFixed(1)}</span>
    </div>
  )
}

function TourCard({
  tour,
  index,
  onReadMore,
}: {
  tour: Tour
  index: number
  onReadMore: (tour: Tour) => void
}) {
  const { openBooking } = useUI()

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 ease-out"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted shrink-0">
        {tour.gallery_urls?.[0] ? (
          <img
            src={tour.gallery_urls[0]}
            alt={tour.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Compass className="text-primary/30 w-12 h-12" />
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Activity badge */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge className="bg-primary/90 text-xs backdrop-blur-sm shadow-sm">
            {tour.activity_type}
          </Badge>
          {tour.is_featured && (
            <Badge variant="secondary" className="bg-white/90 text-foreground text-xs shadow-sm">
              Featured
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
          From ${tour.price_from}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-primary" /> {tour.destination}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-primary" /> {tour.duration_days}d
            </span>
            {tour.max_group_size && (
              <span className="flex items-center gap-1">
                <Users size={11} className="text-primary" /> {tour.max_group_size}
              </span>
            )}
          </div>
          <StarRating />
        </div>

        <h3 className="font-serif font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {tour.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
          {tour.summary}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full text-xs border-primary/20 hover:bg-primary/5 hover:border-primary/50 text-primary"
            onClick={() => onReadMore(tour)}
          >
            Read More
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-full text-xs"
            onClick={() => openBooking(tour.id, tour.title)}
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

export function FeaturedTours() {
  const [, navigate] = useLocation()
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const { data: tours = [], isLoading } = useGetFeaturedTours()

  const shown = tours.slice(0, 6)

  return (
    <section className="py-24 md:py-32 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              <Compass size={14} />
              Featured Tours
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              Handpicked Journeys,<br />Crafted With Care
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Button
              variant="outline"
              className="rounded-full gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              onClick={() => navigate('/tours')}
            >
              View All Tours <ArrowRight size={15} />
            </Button>
          </motion.div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((tour, i) => (
              <TourCard
                key={tour.id}
                tour={tour}
                index={i}
                onReadMore={setSelectedTour}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <TourReadMoreModal
        tour={selectedTour}
        onClose={() => setSelectedTour(null)}
      />
    </section>
  )
}
