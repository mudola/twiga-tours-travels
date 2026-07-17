import { useState, useEffect } from 'react'
import { useUI } from '@/context/ui-context'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateBooking, useListTours } from '@workspace/api-client-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Check, ChevronRight, ChevronLeft, CheckCircle2, Calendar, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Schema ──────────────────────────────────────────────────────────────────

const bookingSchema = z.object({
  tour_id: z.string().optional(),
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone number is required'),
  travel_start_date: z.string().min(1, 'Travel date is required'),
  num_travelers: z.coerce.number().min(1).max(20),
  accommodation_level: z.string().optional(),
  special_requests: z.string().optional(),
})

type BookingValues = z.infer<typeof bookingSchema>

const STEPS = [
  { num: 1, title: 'Trip Details' },
  { num: 2, title: 'Preferences' },
  { num: 3, title: 'Your Info' },
]

// ─── Step progress indicator ──────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="relative flex justify-between items-center mb-8 px-1">
      {/* Track */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-border -z-10" />
      {/* Fill */}
      <motion.div
        className="absolute top-4 left-0 h-0.5 bg-primary -z-10"
        animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
      {STEPS.map(s => (
        <div key={s.num} className="flex flex-col items-center gap-2">
          <div
            className={[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 border-2 bg-background',
              step > s.num
                ? 'border-primary bg-primary text-primary-foreground'
                : step === s.num
                ? 'border-primary text-primary'
                : 'border-border text-muted-foreground',
            ].join(' ')}
          >
            {step > s.num ? <Check size={13} /> : s.num}
          </div>
          <span
            className={`text-xs font-medium ${
              step >= s.num ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {s.title}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Inner form (keyed so it resets on fresh open) ───────────────────────────

function BookingForm({
  defaultTourId,
  defaultTourTitle,
  onSuccess,
}: {
  defaultTourId?: string
  defaultTourTitle?: string
  onSuccess: () => void
}) {
  const [step, setStep] = useState(1)
  const { data: tours = [] } = useListTours()
  const createBooking = useCreateBooking()

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tour_id: defaultTourId ?? 'custom',
      full_name: '',
      email: '',
      phone: '',
      travel_start_date: '',
      num_travelers: 2,
      accommodation_level: 'luxury',
      special_requests: '',
    },
  })

  const selectedTourId = form.watch('tour_id')
  const selectedTour = tours.find(t => t.id === selectedTourId)

  const handleNext = async () => {
    const fields: (keyof BookingValues)[] =
      step === 1
        ? ['tour_id', 'travel_start_date', 'num_travelers']
        : step === 2
        ? ['accommodation_level']
        : []
    const valid = await form.trigger(fields)
    if (valid) setStep(s => s + 1)
  }

  const onSubmit = (data: BookingValues) => {
    createBooking.mutate(
      {
        data: {
          ...data,
          tour_id: data.tour_id === 'custom' ? undefined : data.tour_id,
          tour_title:
            data.tour_id === 'custom'
              ? 'Custom Itinerary'
              : selectedTour?.title ?? defaultTourTitle,
        },
      },
      { onSuccess }
    )
  }

  const slideVariants = {
    enter: { opacity: 0, x: 18 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -18 },
  }

  return (
    <div className="flex flex-col h-full">
      <StepIndicator step={step} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          {/* Scrollable step content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="step-1"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="tour_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Which journey interests you?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select a tour" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="custom" className="font-medium text-primary">
                              Custom / Help me decide
                            </SelectItem>
                            {tours.map(t => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.title} ({t.duration_days} days)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="travel_start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" className="h-11" {...field} />
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
                          <FormLabel>Travelers</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="20" className="h-11" {...field} />
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
                  key="step-2"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="accommodation_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accommodation Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mid-range">
                              Mid-Range — Comfortable lodges &amp; camps
                            </SelectItem>
                            <SelectItem value="luxury">
                              Luxury — Premium boutique camps
                            </SelectItem>
                            <SelectItem value="ultra-luxury">
                              Ultra Luxury — Exclusive 5-star properties
                            </SelectItem>
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
                        <FormLabel>Special Requests</FormLabel>
                        <FormDescription>
                          Honeymoon, dietary needs, mobility requirements, wildlife interests…
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your dream trip…"
                            className="h-32 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="h-11"
                            {...field}
                          />
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
                        <FormLabel>Phone (with country code)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 234 567 8900"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Summary */}
                  <div className="bg-primary/5 rounded-xl p-4 text-sm space-y-1.5">
                    <p className="font-semibold mb-2 text-foreground">Inquiry Summary</p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Tour: </span>
                      {selectedTour?.title ?? defaultTourTitle ?? 'Custom Itinerary'}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Travelers: </span>
                      {form.watch('num_travelers')}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Date: </span>
                      {form.watch('travel_start_date') || '—'}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Style: </span>
                      {form.watch('accommodation_level')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t shrink-0">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(s => s - 1)}
                className="gap-2"
              >
                <ChevronLeft size={15} /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < STEPS.length ? (
              <Button type="button" onClick={handleNext} className="rounded-full gap-2">
                Next <ChevronRight size={15} />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="rounded-full min-w-[140px]"
              >
                {createBooking.isPending ? 'Submitting…' : 'Submit Inquiry'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center flex-1 text-center py-6 space-y-6"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </div>

      <div>
        <h3 className="text-2xl font-serif font-bold mb-2">Inquiry Received</h3>
        <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Asante sana! Our safari experts will review your details and be in touch within
          24 hours.
        </p>
      </div>

      <div className="w-full bg-muted rounded-xl p-5 text-left space-y-4">
        <div className="flex gap-3 text-sm">
          <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Check your email</p>
            <p className="text-muted-foreground">We've sent a summary of your inquiry.</p>
          </div>
        </div>
        <div className="flex gap-3 text-sm">
          <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Next steps</p>
            <p className="text-muted-foreground">
              Your guide will contact you to finalize the itinerary and confirm
              availability.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={onClose} className="rounded-full w-full" size="lg">
        Done
      </Button>
    </motion.div>
  )
}

// ─── Exported sheet ───────────────────────────────────────────────────────────

export function BookingSheet() {
  const { bookingOpen, bookingTourId, bookingTourTitle, closeBooking } = useUI()
  const [submitted, setSubmitted] = useState(false)

  // Reset submitted state each time a fresh booking session opens
  useEffect(() => {
    if (bookingOpen) setSubmitted(false)
  }, [bookingOpen, bookingTourId])

  return (
    <Sheet open={bookingOpen} onOpenChange={open => !open && closeBooking()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl flex flex-col p-0 gap-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="font-serif text-xl">
            {submitted ? 'Booking Confirmed' : 'Plan Your Journey'}
          </SheetTitle>
          <SheetDescription>
            {submitted
              ? 'We have received your inquiry.'
              : 'No payment required — we will follow up with a personalised quote.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
          {submitted ? (
            <SuccessPanel onClose={closeBooking} />
          ) : (
            <BookingForm
              key={`${bookingTourId ?? 'none'}__${String(bookingOpen)}`}
              defaultTourId={bookingTourId}
              defaultTourTitle={bookingTourTitle}
              onSuccess={() => setSubmitted(true)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
