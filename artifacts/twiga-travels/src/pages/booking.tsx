import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { Layout } from "@/components/layout/Layout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateBooking, useListTours } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { Check, ChevronRight, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const bookingSchema = z.object({
  tour_id: z.string().optional(),
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone number is required"),
  travel_start_date: z.string().min(1, "Travel date is required"),
  num_travelers: z.coerce.number().min(1).max(20),
  accommodation_level: z.string().optional(),
  special_requests: z.string().optional(),
})

type BookingValues = z.infer<typeof bookingSchema>

export default function BookingFlow() {
  const [location, setLocation] = useLocation()
  const [searchParams] = useState(() => new URLSearchParams(window.location.search))
  const initialTourId = searchParams.get("tour_id") || undefined

  const [step, setStep] = useState(1)
  const { data: tours = [] } = useListTours()
  
  const createBooking = useCreateBooking()

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tour_id: initialTourId || "custom",
      full_name: "",
      email: "",
      phone: "",
      travel_start_date: "",
      num_travelers: 2,
      accommodation_level: "luxury",
      special_requests: "",
    },
  })

  // Selected tour for summary
  const selectedTourId = form.watch("tour_id")
  const selectedTour = tours.find(t => t.id === selectedTourId)

  const steps = [
    { num: 1, title: "Trip Details" },
    { num: 2, title: "Preferences" },
    { num: 3, title: "Your Info" }
  ]

  const onNext = async () => {
    let fieldsToValidate: any[] = []
    
    if (step === 1) fieldsToValidate = ["tour_id", "travel_start_date", "num_travelers"]
    if (step === 2) fieldsToValidate = ["accommodation_level"]
    
    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setStep(s => Math.min(3, s + 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onPrev = () => setStep(s => Math.max(1, s - 1))

  const onSubmit = (data: BookingValues) => {
    const payload = {
      ...data,
      tour_id: data.tour_id === "custom" ? undefined : data.tour_id,
      tour_title: data.tour_id === "custom" ? "Custom Itinerary" : selectedTour?.title
    }

    createBooking.mutate({ data: payload }, {
      onSuccess: () => {
        setLocation("/booking/confirmation")
      }
    })
  }

  return (
    <Layout>
      <div className="min-h-[80vh] bg-muted/30 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">Plan Your Journey</h1>
            
            {/* Progress Bar */}
            <div className="relative flex justify-between items-center max-w-md mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 -translate-y-1/2" />
              <motion.div 
                className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
              
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step > s.num ? 'bg-primary text-primary-foreground' :
                    step === s.num ? 'bg-background border-2 border-primary text-primary' :
                    'bg-background border-2 border-border text-muted-foreground'
                  }`}>
                    {step > s.num ? <Check size={14} /> : s.num}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-6 md:p-8 shadow-xl border-transparent">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="tour_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Which journey interests you?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select a tour" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="custom" className="font-semibold text-primary">Custom / Help me decide</SelectItem>
                                {tours.map(t => (
                                  <SelectItem key={t.id} value={t.id}>{t.title} ({t.duration_days} Days)</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="travel_start_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Approximate Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" className="h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="num_travelers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Travelers</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" max="20" className="h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="accommodation_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Preferred Accommodation Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mid-range">Mid-Range (Comfortable lodges & camps)</SelectItem>
                                <SelectItem value="luxury">Luxury (Premium boutique camps)</SelectItem>
                                <SelectItem value="ultra-luxury">Ultra Luxury (Exclusive 5-star properties)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="special_requests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Special Requests or Occasions</FormLabel>
                            <FormDescription>Honeymoon, dietary requirements, mobility needs, specific wildlife interests, etc.</FormDescription>
                            <FormControl>
                              <Textarea placeholder="Tell us more about your dream trip..." className="h-32 resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" className="h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (with country code)</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 234 567 8900" className="h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Summary box before submit */}
                      <div className="bg-primary/5 p-4 rounded-xl mt-8">
                        <h4 className="font-semibold mb-2">Inquiry Summary</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li><strong>Tour:</strong> {selectedTour?.title || "Custom Itinerary"}</li>
                          <li><strong>Travelers:</strong> {form.watch("num_travelers")}</li>
                          <li><strong>Date:</strong> {form.watch("travel_start_date")}</li>
                          <li><strong>Style:</strong> {form.watch("accommodation_level")}</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-6 border-t">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={onPrev} className="h-12 px-6">
                      Back
                    </Button>
                  ) : <div />}

                  {step < 3 ? (
                    <Button type="button" onClick={onNext} className="h-12 px-8 rounded-full">
                      Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={createBooking.isPending} className="h-12 px-8 rounded-full shadow-lg">
                      {createBooking.isPending ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  )}
                </div>

              </form>
            </Form>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
