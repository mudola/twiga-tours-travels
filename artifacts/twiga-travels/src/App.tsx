import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { UIProvider } from '@/context/ui-context';
import { BookingSheet } from '@/components/BookingSheet';
import { InquirySheet } from '@/components/InquirySheet';
import { TourQuickViewModal } from '@/components/TourQuickViewModal';

// Pages
import Home from '@/pages/home';
import Tours from '@/pages/tours';
import TourDetail from '@/pages/tour-detail';
import Destinations from '@/pages/destinations';
import Gallery from '@/pages/gallery';
import Blog from '@/pages/blog';
import About from '@/pages/about';
import Contact from '@/pages/contact';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tours" component={Tours} />
      <Route path="/tours/:slug" component={TourDetail} />
      <Route path="/destinations" component={Destinations} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/blog" component={Blog} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="savanna" storageKey="twiga-theme">
        <UIProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <BookingSheet />
            <InquirySheet />
            <TourQuickViewModal />
            <Toaster position="top-center" />
          </TooltipProvider>
        </UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
