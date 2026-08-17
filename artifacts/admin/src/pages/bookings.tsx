import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListBookings,
  useAdminUpdateBookingStatus,
  getAdminListBookingsQueryKey,
} from '@workspace/api-client-react';
import type { Booking } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

function statusBadge(status: string) {
  const variants: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default function BookingsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

  const { data: bookings, isLoading } = useAdminListBookings(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const updateMutation = useAdminUpdateBookingStatus({
    mutation: {
      onSuccess: () => {
        toast({ title: 'Status updated' });
        qc.invalidateQueries({ queryKey: getAdminListBookingsQueryKey() });
      },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const handleStatusChange = (bookingId: string, status: string) => {
    updateMutation.mutate({ id: bookingId, data: { status } });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Bookings</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Travelers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                    ))
                  : bookings?.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium whitespace-nowrap">{b.full_name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{b.email}</TableCell>
                        <TableCell className="max-w-[140px] truncate text-sm">{b.tour_title ?? '—'}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{new Date(b.travel_start_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">{b.num_travelers}</TableCell>
                        <TableCell>{statusBadge(b.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Select
                              value={b.status}
                              onValueChange={(v) => handleStatusChange(b.id, v)}
                            >
                              <SelectTrigger className="h-7 w-28 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((s) => (
                                  <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={() => setViewBooking(b)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && (!bookings || bookings.length === 0) && (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No bookings found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details modal */}
      <Dialog open={!!viewBooking} onOpenChange={(o) => !o && setViewBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
          {viewBooking && (
            <div className="space-y-3 text-sm">
              {[
                ['Name', viewBooking.full_name],
                ['Email', viewBooking.email],
                ['Phone', viewBooking.phone],
                ['Tour', viewBooking.tour_title ?? '—'],
                ['Travel Start', new Date(viewBooking.travel_start_date).toLocaleDateString()],
                ['Travel End', viewBooking.travel_end_date ? new Date(viewBooking.travel_end_date).toLocaleDateString() : '—'],
                ['Travelers', String(viewBooking.num_travelers)],
                ['Accommodation', viewBooking.accommodation_level ?? '—'],
                ['Status', viewBooking.status],
                ['Created', new Date(viewBooking.created_at).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="font-medium w-32 flex-shrink-0 text-muted-foreground">{label}:</span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
              {viewBooking.special_requests && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Special Requests:</p>
                  <p className="text-foreground bg-muted rounded-md p-3">{viewBooking.special_requests}</p>
                </div>
              )}
              {viewBooking.add_ons && viewBooking.add_ons.length > 0 && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Add-ons:</p>
                  <div className="flex flex-wrap gap-1">
                    {viewBooking.add_ons.map((a) => <Badge key={a} variant="secondary">{a}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
