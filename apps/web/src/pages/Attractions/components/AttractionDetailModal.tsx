import { DialogHeader, DialogTitle } from '@/shared/common/ui/dialog';
import { Separator } from '@/shared/common/ui/separator';
import { MapPin } from '@phosphor-icons/react';
import type { Attraction } from '@/shared/types';

export function AttractionDetailModal({ attraction }: { attraction: Attraction }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-serif">{attraction.name}</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attraction.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${attraction.name} ${idx + 1}`}
              className="w-full aspect-video object-cover rounded-lg"
            />
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Sobre</h3>
          <p className="text-muted-foreground">{attraction.description}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Informações</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                <span>{attraction.address}</span>
              </div>
              {attraction.schedule && (
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-muted-foreground">{attraction.schedule}</p>
                </div>
              )}
              {attraction.entryFee && (
                <div>
                  <p className="font-medium">Entrada</p>
                  <p className="text-muted-foreground">{attraction.entryFee}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Destaques</h3>
            <ul className="space-y-1 text-sm">
              {attraction.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cta mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
