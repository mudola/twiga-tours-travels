import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListDestinations,
  useAdminCreateDestination,
  useAdminUpdateDestination,
  useAdminDeleteDestination,
  getAdminListDestinationsQueryKey,
} from '@workspace/api-client-react';
import type { AdminDestination, AdminDestinationInput } from '@workspace/api-client-react';
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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

const emptyForm: AdminDestinationInput = {
  name: '', slug: '', country: '', region: '', image_url: '', description: '', is_featured: false,
};

export default function DestinationsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: destinations, isLoading } = useAdminListDestinations();
  const [modalOpen, setModalOpen] = useState(false);
  const [editDest, setEditDest] = useState<AdminDestination | null>(null);
  const [form, setForm] = useState<AdminDestinationInput>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getAdminListDestinationsQueryKey() });

  const createMutation = useAdminCreateDestination({
    mutation: {
      onSuccess: () => { toast({ title: 'Destination created' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const updateMutation = useAdminUpdateDestination({
    mutation: {
      onSuccess: () => { toast({ title: 'Destination updated' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const deleteMutation = useAdminDeleteDestination({
    mutation: {
      onSuccess: () => { toast({ title: 'Destination deleted' }); invalidate(); setDeleteId(null); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const openCreate = () => { setEditDest(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d: AdminDestination) => {
    setEditDest(d);
    setForm({ name: d.name, slug: d.slug, country: d.country, region: d.region ?? '', image_url: d.image_url ?? '', description: d.description ?? '', is_featured: d.is_featured });
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => setForm((f) => ({ ...f, name, slug: slugify(name) }));

  const handleSubmit = () => {
    if (editDest) {
      updateMutation.mutate({ id: editDest.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Destinations</CardTitle>
          <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Destination</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                    ))
                  : destinations?.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{d.slug}</TableCell>
                        <TableCell>{d.country}</TableCell>
                        <TableCell>{d.region ?? '—'}</TableCell>
                        <TableCell>{d.is_featured ? <Badge className="text-xs">Featured</Badge> : <Badge variant="secondary" className="text-xs">No</Badge>}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && (!destinations || destinations.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No destinations yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editDest ? 'Edit Destination' : 'Create Destination'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Serengeti" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="serengeti" />
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="Tanzania" />
            </div>
            <div className="space-y-1.5">
              <Label>Region</Label>
              <Input value={form.region ?? ''} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} placeholder="East Africa" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Image URL</Label>
              <Input value={form.image_url ?? ''} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="https://…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured ?? false} onCheckedChange={(v) => setForm((f) => ({ ...f, is_featured: v }))} id="dest_featured" />
              <Label htmlFor="dest_featured">Featured</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              {editDest ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Destination?</AlertDialogTitle>
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
