import { Layout } from '@/components/layout/Layout'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedDestinations } from '@/components/home/FeaturedDestinations'
import { FeaturedTours } from '@/components/home/FeaturedTours'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { Testimonials } from '@/components/home/Testimonials'
import { CTASection } from '@/components/home/CTASection'

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeaturedDestinations />
      <FeaturedTours />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </Layout>
  )
}
