import { useParams, Link } from 'wouter'
import { useGetTourBySlug, useListTours, getGetTourBySlugQueryKey, getListToursQueryKey } from '@workspace/api-client-react'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { MapPin, Clock, Users, Calendar, Check, X, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { TourCard } from '@/components/TourCard'
import { useUI } from '@/context/ui-context'

export default function TourDetail() {
  const { slug } = useParams()
  const { openBooking } = useUI()

  const { data: tour, isLoading } = useGetTourBySlug(slug ?? '', {
    query: {
      enabled: !!slug,
      queryKey: getGetTourBySlugQueryKey(slug ?? ''),
    },
  })

  const similarParams = { destination: tour?.destination }
  const { data: similarTours = [] } = useListTours(
    similarParams,
    { query: { enabled: !!tour?.destination, queryKey: getListToursQueryKey(similarParams) } }
  )

  const [activeImageIdx, setActiveImageIdx] = useState(0)

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-12 min-h-screen flex flex-col">
          <div className="h-[60vh] bg-muted animate-pulse mb-8" />
          <div className="container mx-auto px-4">
            <div className="h-96 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      </Layout>
    )
  }

  if (!tour) {
    return (
      <Layout>
        <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Tour not found</h1>
          <Button asChild>
            <Link href="/tours">Back to Tours</Link>
          </Button>
        </div>
      </Layout>
    )
  }

  const otherTours = similarTours.filter(t => t.id !== tour.id).slice(0, 3)

  return (
    <Layout>
      {/* Hero Gallery */}
      <div className="relative pt-20 h-[60vh] md:h-[70vh] bg-black">
        {tour.gallery_urls && tour.gallery_urls.length > 0 ? (
          <>
            <motion.img
              key={activeImageIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={tour.gallery_urls[activeImageIdx]}
              alt={tour.title}
              className="w-full h-full object-cover opacity-80"
            />
            {tour.gallery_urls.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {tour.gallery_urls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === activeImageIdx
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground opacity-20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />

        <div className="absolute top-24 left-4 md:left-8 z-20">
          <Link
            href="/tours"
            className="inline-flex items-center text-white hover:text-primary transition-colors bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to tours
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 -mt-20">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-transparent">
                  {tour.activity_type}
                </Badge>
                {tour.is_featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                {tour.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground mb-8 py-4 border-y">
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary w-5 h-5" />
                  <span>{tour.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary w-5 h-5" />
                  <span>{tour.duration_days} Days</span>
                </div>
                {tour.max_group_size && (
                  <div className="flex items-center gap-2">
                    <Users className="text-primary w-5 h-5" />
                    <span>Max {tour.max_group_size} people</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary w-5 h-5" />
                  <span>Daily Departures</span>
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                <p>{tour.summary}</p>
              </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold">Itinerary</h2>
              <Accordion type="multiple" className="space-y-4">
                {tour.itinerary.map((day, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`day-${day.day}`}
                    className="bg-card border rounded-xl overflow-hidden px-2"
                  >
                    <AccordionTrigger className="hover:no-underline px-4 py-5">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="font-serif font-bold text-primary">D{day.day}</span>
                        </div>
                        <span className="font-serif font-semibold text-lg">{day.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-6 pt-2 ml-16">
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {day.description}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
                        {day.accommodation && (
                          <div>
                            <strong className="text-foreground block mb-1">Accommodation</strong>
                            <span className="text-muted-foreground">{day.accommodation}</span>
                          </div>
                        )}
                        {day.meals && (
                          <div>
                            <strong className="text-foreground block mb-1">Meals Included</strong>
                            <span className="text-muted-foreground">{day.meals}</span>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
                  <Check className="text-primary" /> What's Included
                </h3>
                <ul className="space-y-3">
                  {tour.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
                  <X className="text-destructive" /> What's Not Included
                </h3>
                <ul className="space-y-3">
                  {tour.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive/50 mt-2 shrink-0" />
                      <span className="text-sm">{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-xl">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Starting from
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-serif font-bold text-primary">
                    ${tour.price_from}
                  </span>
                  <span className="text-muted-foreground mb-1">/ person</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{tour.duration_days} Days</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium">{tour.destination}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Group Size</span>
                  <span className="font-medium">
                    {tour.max_group_size ? `Up to ${tour.max_group_size}` : 'Flexible'}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg rounded-xl mb-4 shadow-lg hover:shadow-xl transition-all"
                onClick={() => openBooking(tour.id, tour.title)}
              >
                Book This Tour
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                No payment required to submit a booking inquiry.
              </p>
            </div>

            <div className="bg-muted p-6 rounded-2xl text-center">
              <h4 className="font-serif font-bold mb-2">Need help deciding?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Our safari experts are available to customise this itinerary for you.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-xl bg-transparent border-primary/20 hover:bg-primary/5 text-primary"
                asChild
              >
                <a
                  href="https://wa.me/254700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Tours */}
        {otherTours.length > 0 && (
          <div className="py-24 mt-12 border-t">
            <h2 className="text-3xl font-serif font-bold mb-8">More in {tour.destination}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherTours.map((t, i) => (
                <TourCard key={t.id} tour={t} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky Book button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t z-40">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-serif font-bold text-lg">${tour.price_from}</p>
          </div>
          <Button
            size="lg"
            className="flex-1 rounded-full shadow-lg"
            onClick={() => openBooking(tour.id, tour.title)}
          >
            Book Now
          </Button>
        </div>
      </div>
    </Layout>
  )
}
