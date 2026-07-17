import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { motion } from "framer-motion"
import { CheckCircle2, Calendar, Mail } from "lucide-react"

export default function BookingConfirmation() {
  return (
    <Layout>
      <div className="min-h-[80vh] bg-muted/30 flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card max-w-lg w-full rounded-2xl shadow-xl border p-8 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold mb-4">Inquiry Received</h1>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Asante sana! Thank you for choosing Twiga Travels. We have received your booking inquiry and our safari experts are already reviewing your details.
          </p>

          <div className="bg-muted p-6 rounded-xl text-left space-y-4 mb-8">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground text-sm">Check your email</h4>
                <p className="text-sm text-muted-foreground">We've sent a summary of your inquiry. We typically reply within 24 hours.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground text-sm">Next Steps</h4>
                <p className="text-sm text-muted-foreground">Your dedicated guide will contact you to finalize the itinerary and confirm availability.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="rounded-full" size="lg">
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full" size="lg">
              <Link href="/tours">Explore More Tours</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
