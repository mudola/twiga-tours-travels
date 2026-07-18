import { Link, useLocation } from 'wouter'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MessageCircle, Menu, X, Search, User,
  MapPin, Phone, Mail, Instagram, Twitter,
  Facebook, Youtube, Send, ArrowRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useHealthCheck, useListDestinations } from '@workspace/api-client-react'
import { useUI } from '@/context/ui-context'

// ─── Search overlay ──────────────────────────────────────────────────────────

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [, navigate] = useLocation()
  const [q, setQ] = useState('')
  const { data: destinations = [] } = useListDestinations()

  const go = (dest?: string) => {
    navigate(`/tours${dest ? `?destination=${encodeURIComponent(dest)}` : ''}`)
    onClose()
    setQ('')
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg gap-6">
        <DialogTitle className="font-serif text-xl">Search Destinations</DialogTitle>
        <div className="flex gap-2">
          <Input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go(q || undefined)}
            placeholder="Enter a destination…"
            className="h-11"
          />
          <Button className="rounded-full px-5" onClick={() => go(q || undefined)}>
            <Search size={16} />
          </Button>
        </div>
        {destinations.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Popular Destinations
            </p>
            <div className="flex flex-wrap gap-2">
              {destinations.map(d => (
                <button
                  key={d.name}
                  onClick={() => go(d.name)}
                  className="px-3.5 py-1.5 rounded-full bg-muted text-sm hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/tours', label: 'Tours' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [location] = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { openBooking } = useUI()

  const isHero = location === '/'
  const solid = scrolled || !isHero

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on nav
  useEffect(() => setMobileOpen(false), [location])

  return (
    <>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-400',
          solid
            ? 'bg-background/95 backdrop-blur-lg border-b shadow-sm py-3'
            : 'bg-transparent py-5',
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              T
            </div>
            <span className={cn(
              'font-serif font-bold text-xl tracking-tight transition-colors',
              solid ? 'text-foreground' : 'text-white',
            )}>
              Twiga <span className="text-primary">Travels</span>
            </span>
          </Link>

          {/* Desktop nav — visible at xl+ */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(link => {
              const active = location === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-200',
                    active
                      ? 'text-primary bg-primary/10'
                      : solid
                      ? 'text-foreground/75 hover:text-foreground hover:bg-muted'
                      : 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop right controls */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
                solid ? 'hover:bg-muted text-foreground/70 hover:text-foreground' : 'hover:bg-white/15 text-white/70 hover:text-white',
              )}
            >
              <Search size={16} />
            </button>

            <button
              aria-label="Account"
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
                solid ? 'hover:bg-muted text-foreground/70 hover:text-foreground' : 'hover:bg-white/15 text-white/70 hover:text-white',
              )}
            >
              <User size={16} />
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            <ThemeSwitcher />

            <Button
              className="rounded-full ml-2 shadow-sm hover:shadow-md transition-all"
              onClick={() => openBooking()}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile right */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
                solid ? 'hover:bg-muted text-foreground/70' : 'hover:bg-white/15 text-white/80',
              )}
            >
              <Search size={16} />
            </button>
            <ThemeSwitcher />
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
                solid ? 'hover:bg-muted text-foreground' : 'hover:bg-white/15 text-white',
              )}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden overflow-hidden bg-background border-b"
            >
              <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => {
                  const active = location === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-xl text-base font-medium transition-colors',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted text-foreground',
                        )}
                      >
                        {link.label}
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </Link>
                    </motion.div>
                  )
                })}
                <div className="pt-3 border-t mt-2">
                  <Button
                    size="lg"
                    className="w-full rounded-xl"
                    onClick={() => { setMobileOpen(false); openBooking() }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

const FOOTER_DESTINATIONS = [
  'Maasai Mara', 'Amboseli', 'Diani Beach', 'Lake Nakuru', 'Samburu', 'Mount Kenya',
]

const SOCIAL = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
]

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  if (submitted) {
    return (
      <p className="text-sm text-primary font-medium py-2">
        ✓ You're on the list! Expect exclusive offers soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
      <Input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="h-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground flex-1"
        required
      />
      <Button type="submit" size="sm" className="rounded-full gap-1 shrink-0">
        <Send size={13} /> Join
      </Button>
    </form>
  )
}

export function Footer() {
  const [, navigate] = useLocation()
  const { data: health } = useHealthCheck()
  const { openInquiry } = useUI()
  const isHealthy = health?.status === 'ok'

  return (
    <footer className="bg-card border-t pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Company */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-lg shadow">
                T
              </div>
              <span className="font-serif font-bold text-xl">Twiga Travels</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium East African safari and travel experiences. We craft unforgettable journeys through Kenya's most breathtaking landscapes and beyond.
            </p>
            <div className="flex gap-2">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-foreground mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-primary"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-foreground mb-5">
              Destinations
            </h4>
            <ul className="space-y-3">
              {FOOTER_DESTINATIONS.map(d => (
                <li key={d}>
                  <button
                    onClick={() => navigate(`/tours?destination=${encodeURIComponent(d)}`)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group text-left"
                  >
                    <ArrowRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-primary shrink-0"
                    />
                    {d}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Newsletter */}
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-widest text-foreground mb-5">
                Support
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin size={13} className="text-primary mt-0.5 shrink-0" />
                  Westlands, Nairobi, Kenya
                </li>
                <li className="flex items-start gap-2">
                  <Phone size={13} className="text-primary mt-0.5 shrink-0" />
                  +254 700 000 000
                </li>
                <li className="flex items-start gap-2">
                  <Mail size={13} className="text-primary mt-0.5 shrink-0" />
                  hello@twigatravels.com
                </li>
              </ul>
              <button
                onClick={openInquiry}
                className="mt-4 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Send a message <ArrowRight size={11} />
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-widest text-foreground mb-3">
                Newsletter
              </h4>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Get exclusive deals and safari inspiration delivered monthly.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} Twiga Travels & Tours. All rights reserved.</p>
            <div className={cn(
              'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium',
              isHealthy ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive',
            )}>
              <div className={cn(
                'w-1.5 h-1.5 rounded-full',
                isHealthy ? 'bg-green-500' : 'bg-destructive',
              )} />
              {isHealthy ? 'All Systems Online' : 'Service Disruption'}
            </div>
          </div>
          <div className="flex gap-5">
            <button className="hover:text-primary transition-colors">Terms</button>
            <button className="hover:text-primary transition-colors">Privacy</button>
            <button className="hover:text-primary transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── WhatsApp FAB ─────────────────────────────────────────────────────────────

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/254700000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 group flex items-center justify-center"
    >
      <MessageCircle size={26} />
      <span className="absolute right-full mr-3 bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        Chat with a Guide
      </span>
    </a>
  )
}

// ─── Layout wrapper ───────────────────────────────────────────────────────────

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
