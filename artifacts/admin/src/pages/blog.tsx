import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListBlogPosts,
  useAdminCreateBlogPost,
  useAdminUpdateBlogPost,
  useAdminDeleteBlogPost,
  getAdminListBlogPostsQueryKey,
} from '@workspace/api-client-react';
import type { AdminBlogPost, AdminBlogPostInput } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function statusBadge(status: string) {
  return status === 'published'
    ? <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">Published</Badge>
    : <Badge variant="secondary" className="text-xs">Draft</Badge>;
}

const emptyForm: AdminBlogPostInput = {
  title: '', slug: '', content: '', excerpt: '', featured_image: '', status: 'draft', category: '', tags: [],
};

export default function BlogPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: posts, isLoading } = useAdminListBlogPosts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<AdminBlogPost | null>(null);
  const [form, setForm] = useState<AdminBlogPostInput>(emptyForm);
  const [tagsText, setTagsText] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getAdminListBlogPostsQueryKey() });

  const createMutation = useAdminCreateBlogPost({
    mutation: {
      onSuccess: () => { toast({ title: 'Post created' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const updateMutation = useAdminUpdateBlogPost({
    mutation: {
      onSuccess: () => { toast({ title: 'Post updated' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const deleteMutation = useAdminDeleteBlogPost({
    mutation: {
      onSuccess: () => { toast({ title: 'Post deleted' }); invalidate(); setDeleteId(null); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const openCreate = () => {
    setEditPost(null);
    setForm(emptyForm);
    setTagsText('');
    setModalOpen(true);
  };

  const openEdit = (p: AdminBlogPost) => {
    setEditPost(p);
    setForm({
      title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt ?? '',
      featured_image: p.featured_image ?? '', status: p.status, category: p.category ?? '', tags: p.tags,
    });
    setTagsText(p.tags.join(', '));
    setModalOpen(true);
  };

  const handleTitleChange = (title: string) => setForm((f) => ({ ...f, title, slug: slugify(title) }));

  const handleSubmit = () => {
    const payload: AdminBlogPostInput = {
      ...form,
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (editPost) {
      updateMutation.mutate({ id: editPost.id, data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Blog Posts</CardTitle>
          <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-1" /> New Post</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                    ))
                  : posts?.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                        <TableCell>{statusBadge(p.status)}</TableCell>
                        <TableCell className="text-sm">{p.category ?? '—'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {p.tags.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                            {p.tags.length > 2 && <Badge variant="outline" className="text-xs">+{p.tags.length - 2}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && (!posts || posts.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No blog posts yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editPost ? 'Edit Post' : 'New Blog Post'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="My Amazing Safari" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="my-amazing-safari" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Travel Tips" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status ?? 'draft'} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Featured Image URL</Label>
              <Input value={form.featured_image ?? ''} onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))} placeholder="https://…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Excerpt</Label>
              <Textarea rows={2} value={form.excerpt ?? ''} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="Brief summary shown in listings…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Content *</Label>
              <Textarea rows={10} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="Full post content…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="safari, africa, wildlife" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              {editPost ? 'Save Changes' : 'Publish Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
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
