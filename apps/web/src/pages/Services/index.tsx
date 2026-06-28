import { useState } from 'react';
import { Dialog, DialogContent } from '@/shared/common/ui/dialog';
import { Input } from '@/shared/common/ui/input';
import { Card, CardContent } from '@/shared/common/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/ui/select';
import { MagnifyingGlass, Briefcase } from '@phosphor-icons/react';
import { ServiceCard } from '@/shared/domain/ServiceCard';
import { ServiceDetailModal } from '@/shared/domain/ServiceDetailModal';
import { useServices } from '@/shared/hooks/useServices';
import { useAllReviews } from '@/shared/hooks/useAllReviews';
import { useUser } from '@/shared/hooks/useUser';
import { getAverageRating } from '@/shared/utils/rating';
import { categoryLabels, type Review, type Service, type ServiceCategory } from '@/shared/types';
import { filterServices } from './utils';

// SPEC_DEVIATION: same rationale as Home (T13) — rendering a ServiceCard needs the provider name
// and the per-service average rating/review count, which useServices() alone doesn't expose.
// Reused useUser/useAllReviews (added in T13) instead of duplicating the lookup here.
function ServicesServiceCard({
  service,
  reviews,
  onClick,
}: {
  service: Service;
  reviews: Review[];
  onClick: () => void;
}) {
  const { data: provider } = useUser(service.userId);
  const serviceReviews = reviews.filter((r) => r.serviceId === service.id);

  return (
    <ServiceCard
      service={service}
      provider={provider?.name || 'Provedor'}
      averageRating={getAverageRating(serviceReviews.map((r) => r.rating))}
      reviewCount={serviceReviews.length}
      onClick={onClick}
    />
  );
}

export function ServicesPage() {
  const { data: services = [] } = useServices();
  const { data: reviews = [] } = useAllReviews();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const filteredServices = filterServices(services, {
    search: searchQuery,
    category: categoryFilter,
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Serviços Turísticos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre os melhores profissionais e empresas da região
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              placeholder="Buscar serviços..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as ServiceCategory | 'all')}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredServices.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nenhum serviço encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServicesServiceCard
                key={service.id}
                service={service}
                reviews={reviews}
                onClick={() => setSelectedServiceId(service.id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedServiceId && (
        <Dialog open={!!selectedServiceId} onOpenChange={() => setSelectedServiceId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <ServiceDetailModal serviceId={selectedServiceId} />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
