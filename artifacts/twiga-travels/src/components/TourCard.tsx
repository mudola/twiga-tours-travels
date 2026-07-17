import { Link } from 'wouter'
import { MapPin, Clock, Eye, CalendarCheck } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Tour } from '@workspace/api-client-react'
import { motion } from 'framer-motion'
import { useUI } from '@/context/ui-context'

interface TourCardProps {
  tour: Tour
  index?: number
}

export function TourCard({ tour, index = 0 }: TourCardProps) {
  const { openQuickView, openBooking } = useUI()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Card className="h-full overflow-hidden flex flex-col border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">

        {/* Image — links to full detail page */}
        <Link href={`/tours/${tour.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted shrink-0">
          {tour.gallery_urls?.[0] ? (
            <img
              src={tour.gallery_urls[0]}
              alt={tour.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/10">
              <span className="font-serif text-xl text-muted-foreground opacity-50">Twiga</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {tour.is_featured && (
              <Badge variant="default" className="bg-primary/90 hover:bg-primary shadow-sm backdrop-blur-sm">
                Featured
              </Badge>
            )}
            <Badge variant="secondary" className="bg-background/90 hover:bg-background shadow-sm backdrop-blur-sm">
              {tour.activity_type}
            </Badge>
          </div>

          {/* Price pill */}
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm font-semibold text-sm">
            From ${tour.price_from}
          </div>

          {/* Hover overlay */}
          <div
            aria-hidden
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <span className="text-white text-sm font-medium flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Eye size={14} /> View Details
            </span>
          </div>
        </Link>

        {/* Header */}
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-primary" />
              {tour.destination}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-primary" />
              {tour.duration_days} days
            </span>
          </div>

          <Link href={`/tours/${tour.slug}`}>
            <h3 className="font-serif text-xl font-bold leading-tight hover:text-primary transition-colors line-clamp-2 cursor-pointer">
              {tour.title}
            </h3>
          </Link>
        </CardHeader>

        {/* Body */}
        <CardContent className="p-5 pt-2 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {tour.summary}
          </p>
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0 border-t border-border/50 mt-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-full text-muted-foreground hover:text-foreground gap-1.5 text-xs"
            onClick={() => openQuickView(tour.slug)}
          >
            <Eye size={13} />
            Quick View
          </Button>

          <Button
            size="sm"
            className="flex-1 rounded-full gap-1.5 text-xs"
            onClick={() => openBooking(tour.id, tour.title)}
          >
            <CalendarCheck size={13} />
            Book
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
