import { Link, useLocation } from 'wouter'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from '@/components/ui/button'
import { MessageCircle, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useHealthCheck } from '@workspace/api-client-react'
import { useUI } from '@/context/ui-context'

export function Navbar() {
  const [location] = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openBooking, openInquiry } = useUI()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHero = !isScrolled && location === '/'

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tours', label: 'Tours' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        isScrolled || location !== '/'
          ? 'bg-background/90 backdrop-blur-md border-b shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl group-hover:scale-105 transition-transform">
            T
          </div>
          <span
            className={cn(
              'font-serif font-bold text-xl tracking-tight',
              isHero ? 'text-white' : 'text-foreground'
            )}
          >
            Twiga <span className="text-primary">Travels</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative py-1',
                  location === link.href
                    ? 'text-primary'
                    : isHero
                    ? 'text-white/90 hover:text-white'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}

            {/* Contact → opens inquiry sheet */}
            <button
              onClick={openInquiry}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary py-1',
                isHero ? 'text-white/90 hover:text-white' : 'text-muted-foreground'
              )}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-4 border-l pl-4 border-border/50">
            <ThemeSwitcher />
            <Button
              className="rounded-full shadow-sm hover:shadow-md transition-shadow"
              onClick={() => openBooking()}
            >
              Book a Trip
            </Button>
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeSwitcher />
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className={cn('p-2 rounded-full', isHero ? 'text-white' : 'text-foreground')}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b shadow-lg overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'text-lg font-medium p-3 rounded-md transition-colors',
                    location === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => { setMobileMenuOpen(false); openInquiry() }}
                className="text-lg font-medium p-3 rounded-md transition-colors text-left text-foreground hover:bg-muted"
              >
                Contact
              </button>

              <div className="pt-4 border-t">
                <Button
                  className="w-full rounded-full"
                  size="lg"
                  onClick={() => { setMobileMenuOpen(false); openBooking() }}
                >
                  Book a Trip
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Footer() {
  const { data: health } = useHealthCheck()
  const { openInquiry, openBooking } = useUI()
  const isHealthy = health?.status === 'ok'

  return (
    <footer className="bg-card border-t py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold">
                T
              </div>
              <span className="font-serif font-bold text-xl">Twiga Travels</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              Premium East African safari and travel experiences. We curate unforgettable
              journeys through Kenya's most breathtaking landscapes.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tours" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Tours
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <button
                  onClick={openInquiry}
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Nairobi, Kenya</li>
              <li>hello@twigatravels.example.com</li>
              <li>+254 700 000 000</li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-full text-primary border-primary/30 hover:bg-primary/5"
              onClick={openInquiry}
            >
              Send a Message
            </Button>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} Twiga Travels & Tours. All rights reserved.</p>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-xs">
              <div className={cn('w-2 h-2 rounded-full', isHealthy ? 'bg-green-500' : 'bg-destructive')} />
              <span>{isHealthy ? 'System Online' : 'System Offline'}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer">Terms</span>
            <span className="hover:text-primary cursor-pointer">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/254700000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with a guide on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-foreground text-background px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with a Guide
      </span>
    </a>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
