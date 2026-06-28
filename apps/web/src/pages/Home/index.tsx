import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/shared/common/ui/dialog';
import { Button } from '@/shared/common/ui/button';
import { Input } from '@/shared/common/ui/input';
import { Card } from '@/shared/common/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/ui/select';
import {
  MagnifyingGlass,
  MapPin,
  Briefcase,
  TreePalm,
  ForkKnife,
  Bed,
  Camera,
} from '@phosphor-icons/react';
import { ServiceCard } from '@/shared/domain/ServiceCard';
import { AttractionCard } from '@/shared/domain/AttractionCard';
import { ServiceDetailModal } from '@/shared/domain/ServiceDetailModal';
import { useServices } from '@/shared/hooks/useServices';
import { useAttractions } from '@/shared/hooks/useAttractions';
import { useAllReviews } from '@/shared/hooks/useAllReviews';
import { useUser } from '@/shared/hooks/useUser';
import { getAverageRating } from '@/shared/utils/rating';
import { categoryLabels, type Review, type Service, type ServiceCategory } from '@/shared/types';

// SPEC_DEVIATION: T13 only lists useServices/useServiceDetail/useAddReview as the hooks Home
// should consume, but rendering the featured/top-rated lists needs (a) the provider name and
// (b) a per-service average rating across the whole reviews collection — neither is exposed by
// those hooks. Reason: rather than re-deriving these helpers locally (recreating the duplicated
// helper bug this task fixes) or fetching per-service detail in a loop (N+1 useServiceDetail
// calls), two small shared hooks were added: useUser(userId) (factored out of the existing
// useServiceDetail provider lookup, no logic duplicated) and useAllReviews() (thin wrapper over
// the existing reviews.service.getAllReviews(), mirroring the useServices()/useAttractions()
// pattern already in shared/hooks). Both invalidate through the same query keys as the rest of
// the data layer, so "add review" still updates Home's rating/sorting via the existing
// useAddReview invalidation (queryKeys.allReviews added there).
function HomeServiceCard({
  service,
  reviews,
  onClick,
  compact,
}: {
  service: Service;
  reviews: Review[];
  onClick: () => void;
  compact?: boolean;
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
      compact={compact}
    />
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { data: services = [] } = useServices();
  const { data: attractions = [] } = useAttractions();
  const { data: reviews = [] } = useAllReviews();

  const averageRatingByService = (service: Service) =>
    getAverageRating(reviews.filter((r) => r.serviceId === service.id).map((r) => r.rating));

  const featuredServices = services.slice(0, 6);
  const topRatedServices = [...services]
    .sort((a, b) => averageRatingByService(b) - averageRatingByService(a))
    .slice(0, 4);

  const handleSearch = () => {
    navigate('/servicos');
  };

  const categories = [
    { key: 'hotel' as ServiceCategory, label: 'Hospedagem', icon: Bed },
    { key: 'restaurant' as ServiceCategory, label: 'Restaurantes', icon: ForkKnife },
    { key: 'tour-agency' as ServiceCategory, label: 'Passeios', icon: TreePalm },
    { key: 'guide' as ServiceCategory, label: 'Guias', icon: Briefcase },
    { key: 'photography' as ServiceCategory, label: 'Fotografia', icon: Camera },
    { key: 'transport' as ServiceCategory, label: 'Transporte', icon: MapPin },
  ];

  return (
    <>
      <section className="relative h-[85vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-[url('https://iili.io/CnM0nh7.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 drop-shadow-2xl">
              Encontre as melhores experiências e serviços de São Lourenço
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-12 opacity-95 drop-shadow-lg font-light">
              Guias turísticos, hospedagens, passeios, gastronomia e experiências locais em um só
              lugar
            </p>

            <Card className="p-2 shadow-2xl max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <MagnifyingGlass
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="O que você procura?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-14 text-base border-0 focus-visible:ring-0"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as ServiceCategory | 'all')}
                >
                  <SelectTrigger className="w-full md:w-48 h-14 border-0 focus:ring-0 text-base">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSearch}
                  className="bg-cta hover:bg-cta/90 text-cta-foreground h-14 px-10 text-base font-semibold"
                >
                  Buscar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-8 text-center">Buscar por Categoria</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(key);
                  navigate('/servicos');
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-accent/10 transition-all hover:scale-105 group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon size={28} className="text-primary" weight="duotone" />
                </div>
                <span className="text-sm font-medium text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Serviços em Destaque</h2>
            <p className="text-lg text-muted-foreground">
              Profissionais e empresas mais procurados em São Lourenço
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredServices.map((service) => (
              <HomeServiceCard
                key={service.id}
                service={service}
                reviews={reviews}
                onClick={() => setSelectedServiceId(service.id)}
              />
            ))}
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/servicos')}
              className="px-8"
            >
              Ver Todos os Serviços
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">
              Experiências Populares
            </h2>
            <p className="text-lg text-muted-foreground">
              Atividades e experiências mais bem avaliadas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRatedServices.map((service) => (
              <HomeServiceCard
                key={service.id}
                service={service}
                reviews={reviews}
                onClick={() => setSelectedServiceId(service.id)}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Atrações Turísticas</h2>
            <p className="text-lg text-muted-foreground">
              Descubra os pontos turísticos imperdíveis da cidade
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {attractions.slice(0, 3).map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} onClick={() => {}} />
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg" onClick={() => navigate('/atracoes')}>
              Ver Todas as Atrações
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-cta via-cta to-cta/90 text-cta-foreground py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-5">
            Tem um negócio em São Lourenço?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-95 max-w-2xl mx-auto">
            Cadastre seu serviço gratuitamente e alcance milhares de visitantes
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/cadastro')}
            className="bg-white text-cta hover:bg-white/90 h-14 px-10 text-lg font-semibold shadow-xl"
          >
            Anunciar Meu Negócio
          </Button>
        </div>
      </section>

      {selectedServiceId && (
        <Dialog open={!!selectedServiceId} onOpenChange={() => setSelectedServiceId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <ServiceDetailModal serviceId={selectedServiceId} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
