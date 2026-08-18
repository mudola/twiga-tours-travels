import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListFaqs,
  useAdminCreateFaq,
  useAdminUpdateFaq,
  useAdminDeleteFaq,
  getAdminListFaqsQueryKey,
} from '@workspace/api-client-react';
import type { AdminFaq, AdminFaqInput } from '@workspace/api-client-react';
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

const emptyForm: AdminFaqInput = { question: '', answer: '', category: '', sort_order: 0, is_published: true };

export default function FaqsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: faqs, isLoading } = useAdminListFaqs();
  const [modalOpen, setModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState<AdminFaq | null>(null);
  const [form, setForm] = useState<AdminFaqInput>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getAdminListFaqsQueryKey() });

  const createMutation = useAdminCreateFaq({
    mutation: {
      onSuccess: () => { toast({ title: 'FAQ created' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const updateMutation = useAdminUpdateFaq({
    mutation: {
      onSuccess: () => { toast({ title: 'FAQ updated' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const deleteMutation = useAdminDeleteFaq({
    mutation: {
      onSuccess: () => { toast({ title: 'FAQ deleted' }); invalidate(); setDeleteId(null); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const openCreate = () => { setEditFaq(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (f: AdminFaq) => {
    setEditFaq(f);
    setForm({ question: f.question, answer: f.answer, category: f.category ?? '', sort_order: f.sort_order, is_published: f.is_published });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (editFaq) {
      updateMutation.mutate({ id: editFaq.id, data: form });
    } else {
      createMutation.mutate({ data: form });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>FAQs</CardTitle>
          <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-1" /> Add FAQ</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                    ))
                  : faqs?.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell className="max-w-[280px]">
                          <p className="truncate font-medium">{faq.question}</p>
                        </TableCell>
                        <TableCell className="text-sm">{faq.category ?? '—'}</TableCell>
                        <TableCell className="text-sm">{faq.sort_order}</TableCell>
                        <TableCell>
                          {faq.is_published
                            ? <Badge className="text-xs">Published</Badge>
                            : <Badge variant="secondary" className="text-xs">Draft</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(faq.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && (!faqs || faqs.length === 0) && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No FAQs yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Question *</Label>
              <Input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} placeholder="What is included in the tour?" />
            </div>
            <div className="space-y-1.5">
              <Label>Answer *</Label>
              <Textarea rows={4} value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} placeholder="The tour includes…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Booking" />
              </div>
              <div className="space-y-1.5">
                <Label>Sort Order</Label>
                <Input type="number" min={0} value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))} id="faq_published" />
              <Label htmlFor="faq_published">Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              {editFaq ? 'Save Changes' : 'Create FAQ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
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
