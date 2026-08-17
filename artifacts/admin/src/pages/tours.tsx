import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListTours,
  useAdminCreateTour,
  useAdminUpdateTour,
  useAdminDeleteTour,
  getAdminListToursQueryKey,
} from '@workspace/api-client-react';
import type { Tour, AdminTourInput, AdminTourUpdate } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const emptyForm: AdminTourInput = {
  title: '',
  slug: '',
  destination: '',
  duration_days: 1,
  price_from: 0,
  summary: '',
  activity_type: '',
  gallery_urls: [],
  inclusions: [],
  exclusions: [],
  is_featured: false,
  max_group_size: null,
};

export default function ToursPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: tours, isLoading } = useAdminListTours();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [form, setForm] = useState<AdminTourInput>(emptyForm);
  const [galleryText, setGalleryText] = useState('');
  const [inclusionsText, setInclusionsText] = useState('');
  const [exclusionsText, setExclusionsText] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getAdminListToursQueryKey() });

  const createMutation = useAdminCreateTour({
    mutation: {
      onSuccess: () => { toast({ title: 'Tour created' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const updateMutation = useAdminUpdateTour({
    mutation: {
      onSuccess: () => { toast({ title: 'Tour updated' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const deleteMutation = useAdminDeleteTour({
    mutation: {
      onSuccess: () => { toast({ title: 'Tour deleted' }); invalidate(); setDeleteId(null); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const openCreate = () => {
    setEditTour(null);
    setForm(emptyForm);
    setGalleryText('');
    setInclusionsText('');
    setExclusionsText('');
    setModalOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditTour(tour);
    setForm({
      title: tour.title,
      slug: tour.slug,
      destination: tour.destination,
      duration_days: tour.duration_days,
      price_from: tour.price_from,
      summary: tour.summary,
      activity_type: tour.activity_type,
      gallery_urls: tour.gallery_urls,
      inclusions: tour.inclusions,
      exclusions: tour.exclusions,
      is_featured: tour.is_featured,
      max_group_size: tour.max_group_size ?? null,
    });
    setGalleryText(tour.gallery_urls.join('\n'));
    setInclusionsText(tour.inclusions.join('\n'));
    setExclusionsText(tour.exclusions.join('\n'));
    setModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugify(title) }));
  };

  const handleSubmit = () => {
    const payload: AdminTourInput = {
      ...form,
      gallery_urls: galleryText.split('\n').map((s) => s.trim()).filter(Boolean),
      inclusions: inclusionsText.split('\n').map((s) => s.trim()).filter(Boolean),
      exclusions: exclusionsText.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    if (editTour) {
      updateMutation.mutate({ id: editTour.id, data: payload as AdminTourUpdate });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Tours</CardTitle>
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Tour
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price From</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : tours?.map((tour) => (
                      <TableRow key={tour.id}>
                        <TableCell className="font-medium max-w-[180px] truncate">{tour.title}</TableCell>
                        <TableCell>{tour.destination}</TableCell>
                        <TableCell>{tour.duration_days}d</TableCell>
                        <TableCell>${tour.price_from.toLocaleString()}</TableCell>
                        <TableCell>
                          {tour.is_featured ? (
                            <Badge variant="default" className="text-xs">Featured</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(tour)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(tour.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && (!tours || tours.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No tours yet. Create your first tour.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTour ? 'Edit Tour' : 'Create Tour'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Safari Adventure" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="safari-adventure" />
            </div>
            <div className="space-y-1.5">
              <Label>Destination</Label>
              <Input value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} placeholder="Serengeti, Tanzania" />
            </div>
            <div className="space-y-1.5">
              <Label>Activity Type</Label>
              <Input value={form.activity_type} onChange={(e) => setForm((f) => ({ ...f, activity_type: e.target.value }))} placeholder="Safari" />
            </div>
            <div className="space-y-1.5">
              <Label>Duration (days)</Label>
              <Input type="number" min={1} value={form.duration_days} onChange={(e) => setForm((f) => ({ ...f, duration_days: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Price From ($)</Label>
              <Input type="number" min={0} value={form.price_from} onChange={(e) => setForm((f) => ({ ...f, price_from: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Max Group Size</Label>
              <Input type="number" min={1} value={form.max_group_size ?? ''} onChange={(e) => setForm((f) => ({ ...f, max_group_size: e.target.value ? Number(e.target.value) : null }))} placeholder="Optional" />
            </div>
            <div className="space-y-1.5 flex items-center gap-3 pt-5">
              <Switch checked={form.is_featured} onCheckedChange={(v) => setForm((f) => ({ ...f, is_featured: v }))} id="is_featured" />
              <Label htmlFor="is_featured">Featured Tour</Label>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Summary</Label>
              <Textarea rows={3} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="Brief description…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Gallery URLs (one per line)</Label>
              <Textarea rows={3} value={galleryText} onChange={(e) => setGalleryText(e.target.value)} placeholder="https://example.com/image1.jpg" />
            </div>
            <div className="space-y-1.5">
              <Label>Inclusions (one per line)</Label>
              <Textarea rows={4} value={inclusionsText} onChange={(e) => setInclusionsText(e.target.value)} placeholder="Accommodation&#10;Park fees&#10;Guide" />
            </div>
            <div className="space-y-1.5">
              <Label>Exclusions (one per line)</Label>
              <Textarea rows={4} value={exclusionsText} onChange={(e) => setExclusionsText(e.target.value)} placeholder="Flights&#10;Visa fees&#10;Tips" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              {editTour ? 'Save Changes' : 'Create Tour'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tour?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
