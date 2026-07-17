import { useState, useMemo } from "react"
import { useLocation } from "wouter"
import { Layout } from "@/components/layout/Layout"
import { TourCard } from "@/components/TourCard"
import { useListTours, useListDestinations, useGetTourStats } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal, Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Tours() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search))
  const initialDestination = searchParams.get("destination") || undefined

  const [destination, setDestination] = useState<string | undefined>(initialDestination)
  const [activityType, setActivityType] = useState<string | undefined>()
  const [durationRange, setDurationRange] = useState<number[]>([1, 14])
  const [showFilters, setShowFilters] = useState(false)

  const { data: destinations = [] } = useListDestinations()
  const { data: stats } = useGetTourStats()

  const queryParams = useMemo(() => ({
    destination: destination === "all" ? undefined : destination,
    activity_type: activityType === "all" ? undefined : activityType,
    min_duration: durationRange[0] > 1 ? durationRange[0] : undefined,
    max_duration: durationRange[1] < 14 ? durationRange[1] : undefined,
  }), [destination, activityType, durationRange])

  const { data: tours = [], isLoading } = useListTours(queryParams)

  const handleReset = () => {
    setDestination(undefined)
    setActivityType(undefined)
    setDurationRange([1, 14])
  }

  return (
    <Layout>
      <div className="bg-primary/5 pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Discover Our Journeys</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find the perfect East African adventure. Filter by destination, experience type, and duration.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between">
            <p className="font-medium">{tours.length} {tours.length === 1 ? 'Tour' : 'Tours'} found</p>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Sidebar Filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:w-1/4 lg:shrink-0 lg:block overflow-hidden lg:overflow-visible"
              >
                <div className="bg-card border rounded-xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif font-bold text-xl">Filters</h2>
                    {(destination || activityType || durationRange[0] !== 1 || durationRange[1] !== 14) && (
                      <button onClick={handleReset} className="text-sm text-primary hover:underline flex items-center">
                        <X className="w-3 h-3 mr-1" /> Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Destination</Label>
                      <Select value={destination || "all"} onValueChange={setDestination}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Destinations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Destinations</SelectItem>
                          {destinations.map(d => (
                            <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Experience Type</Label>
                      <Select value={activityType || "all"} onValueChange={setActivityType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Experiences" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Experiences</SelectItem>
                          {stats?.activity_types.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Duration (Days)</Label>
                        <span className="text-xs text-muted-foreground font-medium">
                          {durationRange[0]} - {durationRange[1]}+
                        </span>
                      </div>
                      <Slider
                        value={durationRange}
                        min={1}
                        max={14}
                        step={1}
                        onValueChange={setDurationRange}
                        className="py-4"
                      />
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Tour Grid */}
          <div className="lg:w-3/4">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="font-medium text-muted-foreground">{tours.length} {tours.length === 1 ? 'Tour' : 'Tours'} found</p>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[450px] bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-24 bg-card border rounded-xl">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-serif font-bold mb-2">No tours found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results.</p>
                <Button onClick={handleReset}>Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {tours.map((tour, idx) => (
                  <TourCard key={tour.id} tour={tour} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
