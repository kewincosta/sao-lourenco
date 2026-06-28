import { Card, CardContent } from '@/shared/common/ui/card';
import { Badge } from '@/shared/common/ui/badge';
import { categoryLabels, type Service } from '@/shared/types';
import { MapPin, User, Star, CheckCircle } from '@phosphor-icons/react';

interface ServiceCardProps {
  service: Service;
  provider: string;
  averageRating: number;
  reviewCount: number;
  onClick: () => void;
  compact?: boolean;
}

export function ServiceCard({
  service,
  provider,
  averageRating,
  reviewCount,
  onClick,
  compact,
}: ServiceCardProps) {
  const isHighlyRated = averageRating >= 4.5;
  const isPopular = reviewCount >= 5;

  if (compact) {
    return (
      <Card
        className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
        onClick={onClick}
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
          <img
            src={service.images[0]}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {isHighlyRated && (
            <Badge className="absolute top-3 left-3 bg-cta text-cta-foreground border-0 font-semibold">
              ⭐ Destaque
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={16} weight="fill" className="text-cta" />
                <span className="font-bold text-sm">{averageRating.toFixed(1)}</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

          <Badge variant="outline" className="mb-2 text-xs">
            {categoryLabels[service.category]}
          </Badge>

          <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2">{service.name}</h3>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={14} />
            <span className="line-clamp-1">{service.address.city}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-muted relative">
        <img
          src={service.images[0]}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isHighlyRated && (
          <Badge className="absolute top-3 right-3 bg-cta text-cta-foreground border-0 font-semibold shadow-lg">
            <Star size={14} weight="fill" className="mr-1" />
            Destaque
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {averageRating > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star size={20} weight="fill" className="text-cta" />
                  <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'})
                </span>
              </div>
            )}

            <Badge variant="secondary" className="mb-3">
              {categoryLabels[service.category]}
            </Badge>

            <h3 className="font-serif font-bold text-xl leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {service.name}
            </h3>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-muted-foreground shrink-0" />
            <span className="text-muted-foreground line-clamp-1">
              {service.address.neighborhood}, {service.address.city} - {service.address.state}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User size={16} className="text-muted-foreground shrink-0" />
            <span className="font-medium line-clamp-1">{provider}</span>
            {isPopular && (
              <CheckCircle size={16} weight="fill" className="text-secondary shrink-0" />
            )}
          </div>
        </div>

        {isPopular && (
          <div className="flex items-center gap-2 text-xs text-secondary font-medium">
            <CheckCircle size={14} weight="fill" />
            <span>Popular entre visitantes</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
