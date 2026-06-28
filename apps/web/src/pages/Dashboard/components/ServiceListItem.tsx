import { Card, CardContent } from '@/shared/common/ui/card';
import { Badge } from '@/shared/common/ui/badge';
import { Button } from '@/shared/common/ui/button';
import { Phone, Envelope, Pencil, Trash } from '@phosphor-icons/react';
import { categoryLabels, type Service } from '@/shared/types';

export function ServiceListItem({
  service,
  onDelete,
}: {
  service: Service;
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <h3 className="font-serif font-semibold text-lg">{service.name}</h3>
              <Badge variant="secondary">{categoryLabels[service.category]}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone size={16} />
                {service.whatsapp}
              </span>
              <span className="flex items-center gap-1">
                <Envelope size={16} />
                {service.email}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline">
              <Pencil size={18} />
            </Button>
            <Button size="icon" variant="destructive" onClick={() => onDelete(service.id)}>
              <Trash size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
