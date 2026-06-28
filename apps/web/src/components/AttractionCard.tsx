import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { attractionCategoryLabels, type Attraction } from '@/lib/types';
import { MapPin } from '@phosphor-icons/react';

interface AttractionCardProps {
  attraction: Attraction;
  onClick: () => void;
}

export function AttractionCard({ attraction, onClick }: AttractionCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
        <img
          src={attraction.images[0]}
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-white/90 text-foreground backdrop-blur-sm"
        >
          {attractionCategoryLabels[attraction.category]}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {attraction.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{attraction.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="shrink-0" />
          <span className="line-clamp-1">{attraction.address}</span>
        </div>
      </CardContent>
    </Card>
  );
}
