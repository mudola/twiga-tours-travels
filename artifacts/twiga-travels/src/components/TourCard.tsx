import { Link } from "wouter"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tour } from "@workspace/api-client-react/src/generated/api.schemas"
import { motion } from "framer-motion"

interface TourCardProps {
  tour: Tour
  index?: number
}

export function TourCard({ tour, index = 0 }: TourCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/tours/${tour.slug}`}>
        <Card className="h-full overflow-hidden flex flex-col group cursor-pointer border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {tour.gallery_urls?.[0] ? (
              <img 
                src={tour.gallery_urls[0]} 
                alt={tour.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/10">
                <span className="font-serif text-xl opacity-50">Twiga</span>
              </div>
            )}
            
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
            
            <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm font-semibold">
              From ${tour.price_from}
            </div>
          </div>
          
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-primary" />
                <span>{tour.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-primary" />
                <span>{tour.duration_days} Days</span>
              </div>
            </div>
            <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {tour.title}
            </h3>
          </CardHeader>
          
          <CardContent className="p-5 pt-2 flex-grow">
            <p className="text-muted-foreground text-sm line-clamp-3">
              {tour.summary}
            </p>
          </CardContent>
          
          <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">View Itinerary</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowRight size={16} />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
