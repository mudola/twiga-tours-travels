import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react'
import { useUI } from '@/context/ui-context'
import { motion } from 'framer-motion'

const contactDetails = [
  {
    icon: MapPin,
    label: 'Nairobi Office',
    lines: ['123 Safari Way, Westlands', 'Nairobi, Kenya'],
  },
  {
    icon: Phone,
    label: 'Phone',
    lines: ['+254 700 000 000', '+1 (800) 123 4567 (US Toll Free)'],
  },
  {
    icon: Mail,
    label: 'Email',
    lines: ['hello@twigatravels.example.com', 'bookings@twigatravels.example.com'],
  },
]

export default function Contact() {
  const { openInquiry } = useUI()

  return (
    <Layout>
      <div className="pt-24 pb-16 bg-card border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have a question about our safaris or want to start planning a custom journey?
            We're here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto items-start">

          {/* Contact info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold">Contact Information</h2>

            {contactDetails.map(({ icon: Icon, label, lines }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{label}</h4>
                  {lines.map(line => (
                    <p key={line} className="text-muted-foreground text-sm">{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}

            <div className="p-6 bg-muted rounded-xl">
              <h3 className="font-serif font-bold mb-2">Office Hours</h3>
              <p className="text-sm text-muted-foreground mb-1">
                Monday – Friday: 8:00 AM – 6:00 PM EAT
              </p>
              <p className="text-sm text-muted-foreground">
                Saturday: 9:00 AM – 1:00 PM EAT
              </p>
            </div>
          </div>

          {/* CTA panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-card border rounded-2xl p-8 shadow-lg flex flex-col items-start gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold mb-2">Send a Message</h2>
              <p className="text-muted-foreground leading-relaxed">
                Fill out a quick form and one of our safari specialists will get back to you
                within 24 hours.
              </p>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                General trip planning questions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Custom itinerary requests
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Group &amp; corporate bookings
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Any other enquiry
              </li>
            </ul>

            <Button
              size="lg"
              className="rounded-full w-full mt-2 shadow-sm"
              onClick={openInquiry}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Open Message Form
            </Button>

            <p className="text-xs text-muted-foreground text-center w-full -mt-2">
              Or WhatsApp us directly at{' '}
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                +254 700 000 000
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
