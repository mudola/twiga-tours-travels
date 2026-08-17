import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListTestimonials,
  useAdminCreateTestimonial,
  useAdminUpdateTestimonial,
  useAdminDeleteTestimonial,
  getAdminListTestimonialsQueryKey,
} from '@workspace/api-client-react';
import type { AdminTestimonial, AdminTestimonialInput } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

const emptyForm: AdminTestimonialInput = {
  author_name: '', author_title: '', avatar_url: '', content: '', rating: 5, is_approved: false,
};

export default function TestimonialsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: testimonials, isLoading } = useAdminListTestimonials();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminTestimonial | null>(null);
  const [form, setForm] = useState<AdminTestimonialInput>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getAdminListTestimonialsQueryKey() });

  const createMutation = useAdminCreateTestimonial({
    mutation: {
      onSuccess: () => { toast({ title: 'Testimonial created' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const updateMutation = useAdminUpdateTestimonial({
    mutation: {
      onSuccess: () => { toast({ title: 'Testimonial updated' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const deleteMutation = useAdminDeleteTestimonial({
    mutation: {
      onSuccess: () => { toast({ title: 'Testimonial deleted' }); invalidate(); setDeleteId(null); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (t: AdminTestimonial) => {
    setEditItem(t);
    setForm({ author_name: t.author_name, author_title: t.author_title ?? '', avatar_url: t.avatar_url ?? '', content: t.content, rating: t.rating, is_approved: t.is_approved });
    setModalOpen(true);
  };

  const handleToggleApproval = (t: AdminTestimonial) => {
    updateMutation.mutate({ id: t.id, data: { is_approved: !t.is_approved } });
  };

  const handleSubmit = () => {
    if (editItem) {
      updateMutation.mutate({ id: editItem.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Testimonials</CardTitle>
          <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Testimonial</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                    ))
                  : testimonials?.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{t.author_name}</p>
                            {t.author_title && <p className="text-xs text-muted-foreground">{t.author_title}</p>}
                          </div>
                        </TableCell>
                        <TableCell><StarRating rating={t.rating} /></TableCell>
                        <TableCell className="max-w-[200px]"><p className="truncate text-sm text-muted-foreground">{t.content}</p></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch checked={t.is_approved} onCheckedChange={() => handleToggleApproval(t)} />
                            <span className="text-xs">{t.is_approved ? 'Yes' : 'No'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && (!testimonials || testimonials.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No testimonials yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editItem ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Author Name *</Label>
              <Input value={form.author_name} onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))} placeholder="Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <Label>Author Title</Label>
              <Input value={form.author_title ?? ''} onChange={(e) => setForm((f) => ({ ...f, author_title: e.target.value }))} placeholder="Safari Traveler" />
            </div>
            <div className="space-y-1.5">
              <Label>Avatar URL</Label>
              <Input value={form.avatar_url ?? ''} onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label>Rating (1–5)</Label>
              <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Content *</Label>
              <Textarea rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="Amazing experience…" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_approved ?? false} onCheckedChange={(v) => setForm((f) => ({ ...f, is_approved: v }))} id="t_approved" />
              <Label htmlFor="t_approved">Approved</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              {editItem ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
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
