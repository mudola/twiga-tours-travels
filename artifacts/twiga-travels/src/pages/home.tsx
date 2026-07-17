import { useHeroImage } from "@/hooks/use-hero-image"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { motion } from "framer-motion"
import { useGetFeaturedTours, useListDestinations, useGetTourStats } from "@workspace/api-client-react"
import { TourCard } from "@/components/TourCard"
import { MapPin, Compass, Shield, Users, ArrowRight, ChevronRight, Star } from "lucide-react"

export default function Home() {
  const heroImg = useHeroImage()
  
  const { data: featuredTours = [], isLoading: isLoadingFeatured } = useGetFeaturedTours()
  const { data: destinations = [], isLoading: isLoadingDestinations } = useListDestinations()
  const { data: stats } = useGetTourStats()

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            key={heroImg}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroImg} 
            alt="East Africa Safari" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-black/40 to-black/20" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 pt-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
                <Star size={14} className="text-primary fill-primary" />
                <span>Premium East African Experiences</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg">
                Discover the Soul of <span className="text-primary italic">Africa</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light leading-relaxed drop-shadow-md">
                Curated safaris, coastal escapes, and highland adventures designed for the discerning traveler. Let our expert guides reveal the untamed beauty of Kenya.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-base h-14 px-8 rounded-full shadow-lg">
                  <Link href="/tours">Explore Journeys</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base h-14 px-8 rounded-full bg-black/20 text-white border-white/30 hover:bg-white/10 hover:text-white backdrop-blur-md">
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar overlay at bottom of hero */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-border">
                <div className="text-center px-4">
                  <p className="text-3xl font-serif font-bold text-primary mb-1">{stats.total_tours}+</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Curated Tours</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-3xl font-serif font-bold text-primary mb-1">{stats.destinations_count}</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Destinations</p>
                </div>
                <div className="text-center px-4 hidden md:block">
                  <p className="text-3xl font-serif font-bold text-primary mb-1">{stats.activity_types.length}</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Experience Types</p>
                </div>
                <div className="text-center px-4 hidden md:block">
                  <p className="text-3xl font-serif font-bold text-primary mb-1">100%</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Local Guides</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Featured Tours */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Signature Experiences</h2>
              <h3 className="text-4xl font-serif font-bold">Featured Journeys</h3>
              <p className="mt-4 text-muted-foreground text-lg">
                Hand-selected itineraries that showcase the absolute best of East Africa's wildlife, landscapes, and cultures.
              </p>
            </div>
            <Button variant="ghost" className="group" asChild>
              <Link href="/tours">
                View All Tours
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[450px] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.slice(0, 3).map((tour, idx) => (
                <TourCard key={tour.id} tour={tour} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-card border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Where to go</h2>
            <h3 className="text-4xl font-serif font-bold">Popular Destinations</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {isLoadingDestinations ? (
              [1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />)
            ) : (
              destinations.slice(0, 4).map((dest, idx) => (
                <Link key={dest.name} href={`/tours?destination=${encodeURIComponent(dest.name)}`}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
                  >
                    {dest.image_url ? (
                      <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform duration-700">
                        <MapPin size={48} className="opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h4 className="text-2xl font-serif font-bold mb-1 group-hover:text-primary transition-colors">{dest.name}</h4>
                      <p className="text-white/80 text-sm font-medium flex items-center gap-1">
                        {dest.tour_count} Tours <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Twiga Section */}
      <section className="py-24 bg-background overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="currentColor"></circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)"></rect>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">The Twiga Difference</h2>
                <h3 className="text-4xl font-serif font-bold mb-6">Why Travel With Us?</h3>
                <p className="text-muted-foreground text-lg">
                  We don't just sell tours; we craft unforgettable African narratives. Every detail is meticulously planned to ensure your journey is seamless, authentic, and extraordinary.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Compass className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl mb-2">Local Expertise</h4>
                    <p className="text-muted-foreground">Our guides are born and raised in East Africa, offering deep knowledge of the terrain, wildlife patterns, and local cultures.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl mb-2">Uncompromised Quality</h4>
                    <p className="text-muted-foreground">From luxury lodges to boutique camps, we personally vet every accommodation and partner to guarantee premium standards.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl mb-2">Intimate Group Sizes</h4>
                    <p className="text-muted-foreground">We believe in personal experiences. Our groups are kept small to minimize footprint and maximize your connection with nature.</p>
                  </div>
                </div>
              </div>

              <Button size="lg" asChild className="rounded-full">
                <Link href="/about">Meet Our Team</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative z-10 shadow-2xl">
                <img src="/src/assets/about-guide.jpg" alt="Safari Guide" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-accent/50 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
