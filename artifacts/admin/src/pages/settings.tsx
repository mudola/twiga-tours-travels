import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminGetSettings,
  useAdminUpdateSettings,
  getAdminGetSettingsQueryKey,
} from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, Loader2 } from 'lucide-react';

const SETTING_KEYS = [
  { key: 'site_name', label: 'Site Name', placeholder: 'Twiga Travels & Tours' },
  { key: 'site_tagline', label: 'Site Tagline', placeholder: 'Discover Africa with Us' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'info@twiga.com' },
  { key: 'contact_phone', label: 'Contact Phone', placeholder: '+254 700 000 000' },
  { key: 'address', label: 'Address', placeholder: 'Nairobi, Kenya' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/twiga' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/twiga' },
  { key: 'twitter_url', label: 'Twitter/X URL', placeholder: 'https://twitter.com/twiga' },
];

export default function SettingsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: settings, isLoading } = useAdminGetSettings();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s) => { map[s.key] = s.value; });
      setValues(map);
    }
  }, [settings]);

  const updateMutation = useAdminUpdateSettings({
    mutation: {
      onSuccess: () => {
        toast({ title: 'Settings saved' });
        qc.invalidateQueries({ queryKey: getAdminGetSettingsQueryKey() });
      },
      onError: (e: unknown) => toast({ title: 'Error', description: String((e as Error).message), variant: 'destructive' }),
    },
  });

  const handleSave = () => {
    const settingsArr = Object.entries(values)
      .filter(([, v]) => v !== undefined)
      .map(([key, value]) => ({ key, value }));
    updateMutation.mutate({ data: { settings: settingsArr } });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>Configure global settings for Twiga Travels & Tours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">General</h3>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              : SETTING_KEYS.slice(0, 5).map((sk) => (
                  <div key={sk.key} className="space-y-1.5">
                    <Label>{sk.label}</Label>
                    <Input
                      value={values[sk.key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [sk.key]: e.target.value }))}
                      placeholder={sk.placeholder}
                    />
                  </div>
                ))}
          </div>

          <Separator />

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Social Media</h3>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              : SETTING_KEYS.slice(5).map((sk) => (
                  <div key={sk.key} className="space-y-1.5">
                    <Label>{sk.label}</Label>
                    <Input
                      value={values[sk.key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [sk.key]: e.target.value }))}
                      placeholder={sk.placeholder}
                    />
                  </div>
                ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving…</>
              ) : (
                <><Save className="mr-2 w-4 h-4" /> Save Settings</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
