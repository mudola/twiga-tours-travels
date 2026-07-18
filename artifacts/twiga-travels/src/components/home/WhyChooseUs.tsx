import { motion } from 'framer-motion'
import { Shield, Users, Wallet, Headphones } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Safe Travel',
    description:
      'Your safety is our highest priority. All guides hold professional certifications, vehicles are safety-inspected, and every itinerary is risk-assessed before departure.',
    accent: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    num: '01',
  },
  {
    icon: Users,
    title: 'Expert Local Guides',
    description:
      'Born and raised across East Africa, our guides bring unmatched wildlife knowledge, cultural insight, and warmth that transforms a trip into a life-changing journey.',
    accent: 'text-primary',
    bg: 'bg-primary/8',
    border: 'border-primary/20',
    num: '02',
  },
  {
    icon: Wallet,
    title: 'Transparent Pricing',
    description:
      "No surprise fees. Every quote is fully itemised so you know exactly what you're paying for — from accommodation and meals to park entry and transfers.",
    accent: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900/50',
    num: '03',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description:
      'From the moment you enquire to the moment you return home, our team is reachable around the clock — by phone, WhatsApp, or email — whenever you need us.',
    accent: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-900/50',
    num: '04',
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Why Twiga Travels
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-5">
              The Standard Every Safari<br />Should Meet
            </h2>
            <p className="text-muted-foreground leading-relaxed md:text-lg">
              We believe that extraordinary travel is built on trust, expertise, and genuine care.
              Here's what sets us apart from the rest.
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
                className={`relative group rounded-2xl border ${f.border} p-7 flex flex-col hover:shadow-lg transition-shadow duration-400`}
              >
                {/* Number watermark */}
                <span className="absolute top-5 right-5 text-[56px] font-serif font-bold text-border/30 leading-none select-none">
                  {f.num}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.border} border flex items-center justify-center mb-6`}>
                  <Icon size={24} className={f.accent} />
                </div>

                <h3 className="font-serif font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
