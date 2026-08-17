import { useClerk, useUser } from '@clerk/react'
import { Link } from 'wouter'
import { ArrowRight, LogOut, Mail, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Account() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading your account…</p>
      </div>
    )
  }

  const displayName = user.fullName || user.primaryEmailAddress?.emailAddress || 'Traveller'
  const email = user.primaryEmailAddress?.emailAddress || 'No email available'
  const initials = displayName
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="container mx-auto px-4 md:px-6 pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">Your account</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Welcome back, {displayName.split(' ')[0]}.</h1>
          <p className="text-muted-foreground mt-3">Manage your profile and continue planning your next East African adventure.</p>
        </div>

        <div className="rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-7 border-b">
            <Avatar className="h-20 w-20 border-4 border-primary/10">
              <AvatarImage src={user.imageUrl} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Mail size={14} /> {email}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 py-7">
            <div className="rounded-2xl bg-muted/60 p-5">
              <UserRound className="text-primary mb-3" size={20} />
              <p className="font-semibold">Profile details</p>
              <p className="text-sm text-muted-foreground mt-1">Your account is secured with Clerk authentication.</p>
            </div>
            <div className="rounded-2xl bg-muted/60 p-5">
              <ArrowRight className="text-primary mb-3" size={20} />
              <p className="font-semibold">Plan your journey</p>
              <p className="text-sm text-muted-foreground mt-1">Browse hand-crafted safari experiences for your next trip.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="rounded-full">
              <Link href="/tours">Explore tours <ArrowRight size={15} className="ml-2" /></Link>
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => signOut({ redirectUrl: import.meta.env.BASE_URL || '/' })}>
              <LogOut size={15} className="mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}