import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminListTeamMembers,
  useAdminCreateTeamMember,
  useAdminUpdateTeamMember,
  useAdminDeleteTeamMember,
  getAdminListTeamMembersQueryKey,
} from '@workspace/api-client-react';
import type { AdminTeamMember, AdminTeamMemberInput } from '@workspace/api-client-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

const emptyForm: AdminTeamMemberInput = { name: '', role_title: '', bio: '', photo_url: '', sort_order: 0, is_active: true };

export default function TeamPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: members, isLoading } = useAdminListTeamMembers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<AdminTeamMember | null>(null);
  const [form, setForm] = useState<AdminTeamMemberInput>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getAdminListTeamMembersQueryKey() });

  const createMutation = useAdminCreateTeamMember({
    mutation: {
      onSuccess: () => { toast({ title: 'Team member added' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const updateMutation = useAdminUpdateTeamMember({
    mutation: {
      onSuccess: () => { toast({ title: 'Team member updated' }); invalidate(); setModalOpen(false); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const deleteMutation = useAdminDeleteTeamMember({
    mutation: {
      onSuccess: () => { toast({ title: 'Team member deleted' }); invalidate(); setDeleteId(null); },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const openCreate = () => { setEditMember(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (m: AdminTeamMember) => {
    setEditMember(m);
    setForm({ name: m.name, role_title: m.role_title, bio: m.bio ?? '', photo_url: m.photo_url ?? '', sort_order: m.sort_order, is_active: m.is_active });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (editMember) {
      updateMutation.mutate({ id: editMember.id, data: form });
    } else {
      createMutation.mutate({ data: form });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Team Members</CardTitle>
          <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Member</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                    ))
                  : members?.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={m.photo_url ?? undefined} />
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {m.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{m.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{m.role_title}</TableCell>
                        <TableCell className="text-sm">{m.sort_order}</TableCell>
                        <TableCell>
                          {m.is_active
                            ? <Badge className="text-xs">Active</Badge>
                            : <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && (!members || members.length === 0) && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No team members yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Kamau" />
            </div>
            <div className="space-y-1.5">
              <Label>Role Title *</Label>
              <Input value={form.role_title} onChange={(e) => setForm((f) => ({ ...f, role_title: e.target.value }))} placeholder="Safari Guide" />
            </div>
            <div className="space-y-1.5">
              <Label>Photo URL</Label>
              <Input value={form.photo_url ?? ''} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea rows={3} value={form.bio ?? ''} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Brief bio…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Sort Order</Label>
                <Input type="number" min={0} value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} id="member_active" />
                <Label htmlFor="member_active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              {editMember ? 'Save Changes' : 'Add Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member?</AlertDialogTitle>
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
