import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/shared/common/ui/button';
import { Input } from '@/shared/common/ui/input';
import { Label } from '@/shared/common/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/ui/card';

export function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cadastro realizado! Faça login para continuar.');
    navigate('/login');
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Cadastrar Serviço</CardTitle>
            <CardDescription>Preencha os dados para começar a anunciar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reg-document">CPF ou CNPJ</Label>
                  <Input id="reg-document" placeholder="000.000.000-00" required />
                </div>
                <div>
                  <Label htmlFor="reg-name">Nome/Razão Social</Label>
                  <Input id="reg-name" placeholder="Seu nome ou empresa" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reg-email">E-mail</Label>
                  <Input id="reg-email" type="email" placeholder="seu@email.com" required />
                </div>
                <div>
                  <Label htmlFor="reg-whatsapp">WhatsApp</Label>
                  <Input id="reg-whatsapp" placeholder="(35) 99999-9999" required />
                </div>
              </div>
              <div>
                <Label htmlFor="reg-address">Endereço Completo</Label>
                <Input id="reg-address" placeholder="Rua, número, bairro, cidade - MG" required />
              </div>
              <Button type="submit" className="w-full bg-cta hover:bg-cta/90 text-cta-foreground">
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
