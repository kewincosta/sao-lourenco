import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/stores/auth.store';
import { Button } from '@/shared/common/ui/button';
import { Input } from '@/shared/common/ui/input';
import { Label } from '@/shared/common/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/ui/card';

export function LoginPage({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [document, setDocument] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(document);
    if (success) {
      const loggedUser = useAuthStore.getState().user;
      toast.success(`Bem-vindo, ${loggedUser?.name}!`);
      onNavigate('dashboard');
      return;
    }
    toast.error('CPF/CNPJ não encontrado');
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Entrar</CardTitle>
            <CardDescription>Acesse sua conta com CPF ou CNPJ</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="document">CPF ou CNPJ</Label>
                <Input
                  id="document"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use qualquer CPF/CNPJ dos usuários mockados
                </p>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
