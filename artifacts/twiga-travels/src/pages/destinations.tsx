import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { useListDestinations } from '@workspace/api-client-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowRight, Globe } from 'lucide-react'

const FALLBACKS: Record<string, string> = {
  'Maasai Mara': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&q=80&fit=crop',
  'Amboseli': 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=900&q=80&fit=crop',
  'Diani Beach': 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=900&q=80&fit=crop',
  'Lake Nakuru': 'https://images.unsplash.com/photo-1621414050946-1e7e1f854774?w=900&q=80&fit=crop',
  'Samburu': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=80&fit=crop',
  'Mount Kenya': 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=900&q=80&fit=crop',
}
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&q=80&fit=crop'

export default function Destinations() {
  const [, navigate] = useLocation()
  const { data: destinations = [], isLoading } = useListDestinations()

  return (
    <Layout>
      {/* Header */}
      <div className="pt-28 pb-16 bg-card border-b">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              <Globe size={14} />
              All Destinations
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              Explore East Africa's<br />Most Iconic Places
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From the sweeping plains of the Maasai Mara to the turquoise
              shores of Diani Beach — discover where your next story begins.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Destinations grid */}
      <div className="py-20 container mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => {
              const img = dest.image_url || FALLBACKS[dest.name] || FALLBACK_IMG
              return (
                <motion.article
                  key={dest.name}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-2xl overflow-hidden bg-muted shadow-md hover:shadow-2xl transition-all duration-400 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/tours?destination=${encodeURIComponent(dest.name)}`)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={img}
                      alt={dest.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Tour count */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/15 text-white border-0 backdrop-blur-md text-xs">
                      {dest.tour_count} {dest.tour_count === 1 ? 'Tour' : 'Tours'}
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <div className="flex items-center gap-1 text-white/65 text-xs mb-1">
                      <MapPin size={10} />
                      <span className="uppercase tracking-wider font-medium">Kenya</span>
                    </div>
                    <h2 className="text-white font-serif text-2xl font-bold mb-2 leading-tight">
                      {dest.name}
                    </h2>
                    {dest.description && (
                      <p className="text-white/75 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {dest.description}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full bg-white/15 hover:bg-white/30 border border-white/20 text-white text-xs backdrop-blur-sm gap-1.5 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      onClick={e => {
                        e.stopPropagation()
                        navigate(`/tours?destination=${encodeURIComponent(dest.name)}`)
                      }}
                    >
                      Explore Tours <ArrowRight size={11} />
                    </Button>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
