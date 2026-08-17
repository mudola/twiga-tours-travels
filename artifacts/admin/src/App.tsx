import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';

import { AuthProvider } from '@/lib/auth';
import { AppLayout } from '@/components/layout/app-layout';

import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import ToursPage from '@/pages/tours';
import DestinationsPage from '@/pages/destinations';
import BookingsPage from '@/pages/bookings';
import InquiriesPage from '@/pages/inquiries';
import GalleryPage from '@/pages/gallery';
import TestimonialsPage from '@/pages/testimonials';
import BlogPage from '@/pages/blog';
import FaqsPage from '@/pages/faqs';
import TeamPage from '@/pages/team';
import SettingsPage from '@/pages/settings';
import UsersPage from '@/pages/users';
import NotFound from '@/pages/not-found';

// Initialize API config before anything else
setBaseUrl('/api');
setAuthTokenGetter(() => localStorage.getItem('admin_token'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ProtectedPage({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/dashboard">
        <ProtectedPage><DashboardPage /></ProtectedPage>
      </Route>
      <Route path="/tours">
        <ProtectedPage><ToursPage /></ProtectedPage>
      </Route>
      <Route path="/destinations">
        <ProtectedPage><DestinationsPage /></ProtectedPage>
      </Route>
      <Route path="/bookings">
        <ProtectedPage><BookingsPage /></ProtectedPage>
      </Route>
      <Route path="/inquiries">
        <ProtectedPage><InquiriesPage /></ProtectedPage>
      </Route>
      <Route path="/gallery">
        <ProtectedPage><GalleryPage /></ProtectedPage>
      </Route>
      <Route path="/testimonials">
        <ProtectedPage><TestimonialsPage /></ProtectedPage>
      </Route>
      <Route path="/blog">
        <ProtectedPage><BlogPage /></ProtectedPage>
      </Route>
      <Route path="/faqs">
        <ProtectedPage><FaqsPage /></ProtectedPage>
      </Route>
      <Route path="/team">
        <ProtectedPage><TeamPage /></ProtectedPage>
      </Route>
      <Route path="/settings">
        <ProtectedPage><SettingsPage /></ProtectedPage>
      </Route>
      <Route path="/users">
        <ProtectedPage><UsersPage /></ProtectedPage>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
