import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { useListDestinations } from '@workspace/api-client-react'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowRight, Compass } from 'lucide-react'

// Curated fallback images per destination (Unsplash)
const FALLBACKS: Record<string, string> = {
  'Maasai Mara': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80&fit=crop',
  'Amboseli': 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=800&q=80&fit=crop',
  'Diani Beach': 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80&fit=crop',
  'Lake Nakuru': 'https://images.unsplash.com/photo-1621414050946-1e7e1f854774?w=800&q=80&fit=crop',
  'Samburu': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80&fit=crop',
  'Mount Kenya': 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800&q=80&fit=crop',
}
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80&fit=crop'

function DestinationCard({
  name,
  country = 'Kenya',
  description,
  imageUrl,
  tourCount,
  index,
  onExplore,
}: {
  name: string
  country?: string
  description?: string | null
  imageUrl?: string | null
  tourCount: number
  index: number
  onExplore: () => void
}) {
  const img = imageUrl || FALLBACKS[name] || DEFAULT_FALLBACK

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4] md:aspect-[4/5] bg-muted shadow-md hover:shadow-2xl transition-shadow duration-500"
      onClick={onExplore}
    >
      {/* Background image */}
      <img
        src={img}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

      {/* Tour count badge */}
      <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-white text-xs font-semibold">
        {tourCount} {tourCount === 1 ? 'Tour' : 'Tours'}
      </div>

      {/* Content — slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-0 transition-transform duration-400">
        <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5">
          <MapPin size={11} />
          <span className="uppercase tracking-wider font-medium">{country}</span>
        </div>
        <h3 className="text-white font-serif text-2xl font-bold leading-tight mb-2">
          {name}
        </h3>

        {/* Description — hidden until hover */}
        <p className="text-white/75 text-sm leading-relaxed line-clamp-2 mb-4 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
          {description || `Experience the untamed beauty of ${name} on an expertly guided journey.`}
        </p>

        <Button
          size="sm"
          variant="secondary"
          className="rounded-full bg-white/15 hover:bg-white/30 border border-white/20 text-white text-xs backdrop-blur-sm gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-75"
          onClick={e => { e.stopPropagation(); onExplore() }}
        >
          Explore <ArrowRight size={12} />
        </Button>
      </div>
    </motion.article>
  )
}

export function FeaturedDestinations() {
  const [, navigate] = useLocation()
  const { data: destinations = [], isLoading } = useListDestinations()
  const shown = destinations.slice(0, 6)

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              <Compass size={14} />
              Destinations
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              Iconic Places,<br />Unforgettable Stories
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
              onClick={() => navigate('/destinations')}
            >
              All Destinations <ArrowRight size={15} />
            </Button>
          </motion.div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] md:aspect-[4/5] bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {shown.map((dest, i) => (
              <DestinationCard
                key={dest.name}
                name={dest.name}
                description={dest.description}
                imageUrl={dest.image_url}
                tourCount={dest.tour_count}
                index={i}
                onExplore={() => navigate(`/tours?destination=${encodeURIComponent(dest.name)}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
