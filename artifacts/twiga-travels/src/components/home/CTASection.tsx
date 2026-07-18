import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useUI } from '@/context/ui-context'
import heroSavanna from '@/assets/hero-savanna.jpg'

export function CTASection() {
  const { openBooking } = useUI()

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroSavanna}
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-12 right-12 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-48 h-48 rounded-full bg-primary/15 blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-5">
            <Sparkles size={14} />
            Start Your Journey
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 max-w-3xl mx-auto">
            Your African Adventure<br />Begins Here
          </h2>

          <p className="text-white/75 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Let our experts craft an itinerary that's perfectly tailored to you.
            No two journeys are the same — and yours will be unforgettable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-14 px-8 text-base rounded-full shadow-2xl hover:shadow-primary/30 gap-2 transition-all"
              onClick={() => openBooking()}
            >
              Book Your Adventure <ArrowRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all gap-2"
              onClick={() => openBooking()}
            >
              <Sparkles size={16} />
              Request Custom Tour
            </Button>
          </div>

          {/* Trust signals */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/60">
            <span>✓ No payment to enquire</span>
            <span>✓ Reply within 24 hours</span>
            <span>✓ Flexible cancellation</span>
            <span>✓ 500+ happy travellers</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
