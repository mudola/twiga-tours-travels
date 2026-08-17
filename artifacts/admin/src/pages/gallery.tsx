import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListGalleryImages,
  useAdminCreateGalleryImage,
  useAdminDeleteGalleryImage,
  getAdminListGalleryImagesQueryKey,
} from '@workspace/api-client-react';
import type { AdminGalleryImageInput } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

const emptyForm: AdminGalleryImageInput = { url: '', caption: '', category: 'general', sort_order: 0 };

export default function GalleryPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: images, isLoading } = useAdminListGalleryImages();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AdminGalleryImageInput>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getAdminListGalleryImagesQueryKey() });

  const createMutation = useAdminCreateGalleryImage({
    mutation: {
      onSuccess: () => { toast({ title: 'Image added' }); invalidate(); setModalOpen(false); setForm(emptyForm); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const deleteMutation = useAdminDeleteGalleryImage({
    mutation: {
      onSuccess: () => { toast({ title: 'Image deleted' }); invalidate(); setDeleteId(null); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Gallery Images</h2>
        <Button onClick={() => { setForm(emptyForm); setModalOpen(true); }} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Image
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
        </div>
      ) : images && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden group relative">
              <div className="aspect-square bg-muted relative">
                <img
                  src={img.url}
                  alt={img.caption ?? ''}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(img.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground truncate">{img.caption ?? img.category}</p>
                <p className="text-xs text-muted-foreground">Order: {img.sort_order}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No gallery images yet. Add your first image.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Gallery Image</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Image URL *</Label>
              <Input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="space-y-1.5">
              <Label>Caption</Label>
              <Input value={form.caption ?? ''} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} placeholder="Beautiful sunset over Kilimanjaro" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="safari, beach, wildlife…" />
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input type="number" min={0} value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.url}>
              {createMutation.isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
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
