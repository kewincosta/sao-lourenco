import { useState } from 'react';
import { Button } from '@/shared/common/ui/button';
import { Input } from '@/shared/common/ui/input';
import { Label } from '@/shared/common/ui/label';
import { Textarea } from '@/shared/common/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/common/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/ui/select';
import { categoryLabels, type ServiceCategory } from '@/shared/types';

export function AddServiceForm({
  defaultWhatsapp,
  defaultEmail,
  onSubmit,
  onCancel,
}: {
  defaultWhatsapp: string;
  defaultEmail: string;
  onSubmit: (input: {
    name: string;
    description: string;
    category: ServiceCategory;
    whatsapp: string;
    email: string;
  }) => void;
  onCancel: () => void;
}) {
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'guide' as ServiceCategory,
    whatsapp: defaultWhatsapp,
    email: defaultEmail,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newService);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Novo Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service-name">Nome do Serviço</Label>
            <Input
              id="service-name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="service-description">Descrição</Label>
            <Textarea
              id="service-description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="service-category">Categoria</Label>
            <Select
              value={newService.category}
              onValueChange={(value) =>
                setNewService({ ...newService, category: value as ServiceCategory })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Salvar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
