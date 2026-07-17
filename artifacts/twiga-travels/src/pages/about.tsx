import { Layout } from "@/components/layout/Layout"
import { motion } from "framer-motion"

export default function About() {
  return (
    <Layout>
      <div className="pt-24 pb-16 bg-card border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Story</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Born from a deep love for the East African wilderness, Twiga Travels was founded with a single mission: to share the raw, untamed beauty of our home with the world, respectfully and authentically.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
            >
              <img src="/src/assets/about-guide.jpg" alt="Twiga Guide" className="w-full h-full object-cover" />
            </motion.div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold">More Than Just a Safari</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                "Twiga" means giraffe in Swahili — a symbol of grace, deep roots, and far-reaching vision. Since our inception, we have curated bespoke journeys that go beyond the typical tourist trails.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe that travel should be transformative. It's not just about seeing the Big Five; it's about feeling the rhythm of the savanna, understanding the delicate balance of the ecosystem, and connecting with the communities that call this land home.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="bg-muted p-8 rounded-2xl">
              <div className="text-primary font-serif text-5xl mb-4 italic">01</div>
              <h3 className="font-bold text-xl mb-2">Sustainable Tourism</h3>
              <p className="text-muted-foreground text-sm">We partner exclusively with eco-conscious lodges and camps that actively protect wildlife and support local communities.</p>
            </div>
            <div className="bg-muted p-8 rounded-2xl">
              <div className="text-primary font-serif text-5xl mb-4 italic">02</div>
              <h3 className="font-bold text-xl mb-2">Local Guides</h3>
              <p className="text-muted-foreground text-sm">100% of our guides are local experts, providing authentic perspectives and unmatched tracking skills.</p>
            </div>
            <div className="bg-muted p-8 rounded-2xl">
              <div className="text-primary font-serif text-5xl mb-4 italic">03</div>
              <h3 className="font-bold text-xl mb-2">Bespoke Service</h3>
              <p className="text-muted-foreground text-sm">No two journeys are the same. We tailor every aspect of your itinerary to your pace, preferences, and passions.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
