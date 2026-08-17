import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Map,
  Globe,
  CalendarCheck,
  MessageSquare,
  Image,
  Star,
  FileText,
  HelpCircle,
  Users,
  Settings,
  UserCog,
  MapPin,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Tours', icon: Map, href: '/tours' },
  { label: 'Destinations', icon: Globe, href: '/destinations' },
  { label: 'Bookings', icon: CalendarCheck, href: '/bookings' },
  { label: 'Inquiries', icon: MessageSquare, href: '/inquiries' },
  { label: 'Gallery', icon: Image, href: '/gallery' },
  { label: 'Testimonials', icon: Star, href: '/testimonials' },
  { label: 'Blog', icon: FileText, href: '/blog' },
  { label: 'FAQs', icon: HelpCircle, href: '/faqs' },
  { label: 'Team', icon: Users, href: '/team' },
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Users', icon: UserCog, href: '/users' },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();

  const handleNav = (href: string) => {
    navigate(href);
    onNavigate?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'A';

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary flex-shrink-0">
          <MapPin className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">Twiga Travels</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">Admin CMS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? location === '/dashboard' || location === '/'
              : location.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? '' : 'opacity-80')} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </button>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User footer */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize truncate">{user?.role ?? 'admin'}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent px-3"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
