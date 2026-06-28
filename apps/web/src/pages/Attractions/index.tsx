import { useState } from 'react';
import { Dialog, DialogContent } from '@/shared/common/ui/dialog';
import { AttractionCard } from '@/shared/domain/AttractionCard';
import { useAttractions } from '@/shared/hooks/useAttractions';
import { AttractionDetailModal } from './components/AttractionDetailModal';

export function AttractionsPage() {
  const { data: attractions = [] } = useAttractions();
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);

  const selectedAttraction = attractions.find((a) => a.id === selectedAttractionId) || null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Atrações Turísticas</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore as maravilhas naturais e culturais de São Lourenço
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              onClick={() => setSelectedAttractionId(attraction.id)}
            />
          ))}
        </div>
      </div>

      {selectedAttraction && (
        <Dialog open={!!selectedAttraction} onOpenChange={() => setSelectedAttractionId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <AttractionDetailModal attraction={selectedAttraction} />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
