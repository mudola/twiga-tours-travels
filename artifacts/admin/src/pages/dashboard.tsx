import { useAdminGetDashboardStats } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CalendarCheck,
  Map,
  MessageSquare,
  Clock,
  Globe,
  FileText,
  Star,
  TrendingUp,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-3xl font-bold text-foreground">{value?.toLocaleString() ?? '—'}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useAdminGetDashboardStats();

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats?.total_bookings,
      icon: <CalendarCheck className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Total Tours',
      value: stats?.total_tours,
      icon: <Map className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-100',
    },
    {
      title: 'Total Inquiries',
      value: stats?.total_inquiries,
      icon: <MessageSquare className="w-5 h-5 text-violet-600" />,
      color: 'bg-violet-100',
    },
    {
      title: 'Pending Bookings',
      value: stats?.pending_bookings,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-100',
    },
    {
      title: 'New Bookings',
      value: stats?.new_bookings,
      icon: <TrendingUp className="w-5 h-5 text-rose-600" />,
      color: 'bg-rose-100',
    },
    {
      title: 'Destinations',
      value: stats?.total_destinations,
      icon: <Globe className="w-5 h-5 text-cyan-600" />,
      color: 'bg-cyan-100',
    },
    {
      title: 'Blog Posts',
      value: stats?.total_blog_posts,
      icon: <FileText className="w-5 h-5 text-orange-600" />,
      color: 'bg-orange-100',
    },
    {
      title: 'Testimonials',
      value: stats?.total_testimonials,
      icon: <Star className="w-5 h-5 text-yellow-600" />,
      color: 'bg-yellow-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">Welcome to Twiga Travels & Tours Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            loading={isLoading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarCheck className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">
                Recent bookings and inquiries will appear here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Add a new tour', href: '/tours' },
              { label: 'View pending bookings', href: '/bookings' },
              { label: 'Review inquiries', href: '/inquiries' },
              { label: 'Manage gallery images', href: '/gallery' },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted hover:bg-accent transition-colors text-sm font-medium"
              >
                {action.label}
                <span className="ml-auto text-muted-foreground">→</span>
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
