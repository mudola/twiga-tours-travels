import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListInquiries,
  useAdminDeleteInquiry,
  getAdminListInquiriesQueryKey,
} from '@workspace/api-client-react';
import type { Inquiry } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Trash2, Loader2 } from 'lucide-react';

export default function InquiriesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: inquiries, isLoading } = useAdminListInquiries();
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteMutation = useAdminDeleteInquiry({
    mutation: {
      onSuccess: () => {
        toast({ title: 'Inquiry deleted' });
        qc.invalidateQueries({ queryKey: getAdminListInquiriesQueryKey() });
        setDeleteId(null);
      },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Inquiries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                    ))
                  : inquiries?.map((inq) => (
                      <TableRow key={inq.id}>
                        <TableCell className="font-medium whitespace-nowrap">{inq.full_name}</TableCell>
                        <TableCell className="text-sm">{inq.email}</TableCell>
                        <TableCell className="text-sm">{inq.phone ?? '—'}</TableCell>
                        <TableCell className="max-w-[220px]">
                          <p className="truncate text-sm text-muted-foreground">{inq.message}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setViewInquiry(inq)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(inq.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && (!inquiries || inquiries.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No inquiries yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewInquiry} onOpenChange={(o) => !o && setViewInquiry(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Inquiry Details</DialogTitle></DialogHeader>
          {viewInquiry && (
            <div className="space-y-3 text-sm">
              {[
                ['Name', viewInquiry.full_name],
                ['Email', viewInquiry.email],
                ['Phone', viewInquiry.phone ?? '—'],
                ['Date', new Date(viewInquiry.created_at).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="font-medium w-20 flex-shrink-0 text-muted-foreground">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
              <div>
                <p className="font-medium text-muted-foreground mb-2">Message:</p>
                <p className="bg-muted rounded-md p-3 whitespace-pre-wrap">{viewInquiry.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}>
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
