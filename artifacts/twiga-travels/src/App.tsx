import { useEffect, useRef } from 'react'
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react'
import { publishableKeyFromHost } from '@clerk/react/internal'
import { shadcn } from '@clerk/themes'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import NotFound from '@/pages/not-found'
import { Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter'
import { ThemeProvider } from '@/components/theme-provider'
import { UIProvider } from '@/context/ui-context'
import { BookingSheet } from '@/components/BookingSheet'
import { InquirySheet } from '@/components/InquirySheet'
import { TourQuickViewModal } from '@/components/TourQuickViewModal'

// Pages
import Home from '@/pages/home'
import Tours from '@/pages/tours'
import TourDetail from '@/pages/tour-detail'
import Destinations from '@/pages/destinations'
import Gallery from '@/pages/gallery'
import Blog from '@/pages/blog'
import About from '@/pages/about'
import Contact from '@/pages/contact'
import BookingFlow from '@/pages/booking'
import BookingConfirmation from '@/pages/booking-confirmation'
import Account from '@/pages/account'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
})

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
)
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment')
}

function stripBase(path: string) {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#D97755',
    colorForeground: '#2C2825',
    colorMutedForeground: '#756D66',
    colorDanger: '#C2413A',
    colorBackground: '#FFFFFF',
    colorInput: '#FAF7F2',
    colorInputForeground: '#2C2825',
    colorNeutral: '#DED6CD',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-2xl w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-foreground',
    headerSubtitle: 'text-muted-foreground',
    socialButtonsBlockButtonText: 'text-foreground',
    formFieldLabel: 'text-foreground',
    footerActionLink: 'text-primary',
    footerActionText: 'text-muted-foreground',
    dividerText: 'text-muted-foreground',
    identityPreviewEditButton: 'text-primary',
    formFieldSuccessText: 'text-green-600',
    alertText: 'text-destructive',
    logoBox: 'rounded-xl overflow-hidden',
    logoImage: 'w-10 h-10',
    socialButtonsBlockButton: 'border-border bg-background hover:bg-muted',
    formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    formFieldInput: 'bg-background border-input text-foreground',
    footerAction: 'text-muted-foreground',
    dividerLine: 'bg-border',
    alert: 'bg-destructive/10 border-destructive/20',
    otpCodeFieldInput: 'border-input bg-background text-foreground',
    formFieldRow: 'text-foreground',
    main: 'bg-transparent',
  },
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/account" />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  )
}

function ProtectedAccount() {
  return (
    <>
      <Show when="signed-in">
        <Account />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  )
}

function SignInPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4 py-12">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  )
}

function SignUpPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4 py-12">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  )
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk()
  const client = useQueryClient()
  const previousUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null
      if (previousUserId.current !== undefined && previousUserId.current !== userId) {
        client.clear()
      }
      previousUserId.current = userId
    })
    return unsubscribe
  }, [addListener, client])

  return null
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/account" component={ProtectedAccount} />
      <Route path="/tours" component={Tours} />
      <Route path="/tours/:slug" component={TourDetail} />
      <Route path="/destinations" component={Destinations} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/blog" component={Blog} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/booking/confirmation" component={BookingConfirmation} />
      <Route path="/booking" component={BookingFlow} />
      <Route component={NotFound} />
    </Switch>
  )
}

function ClerkApp() {
  const [, setLocation] = useLocation()

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: 'Welcome back', subtitle: 'Sign in to access your travel account' } },
        signUp: { start: { title: 'Create your account', subtitle: 'Start planning your next adventure' } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ClerkQueryClientCacheInvalidator />
      <Router />
    </ClerkProvider>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="savanna" storageKey="twiga-theme">
        <UIProvider>
          <TooltipProvider>
            <WouterRouter base={basePath}>
              <ClerkApp />
            </WouterRouter>
            <BookingSheet />
            <InquirySheet />
            <TourQuickViewModal />
            <Toaster position="top-center" />
          </TooltipProvider>
        </UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App