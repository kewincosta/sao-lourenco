import { useState } from 'react';
import { RatingStars } from '@/shared/common/RatingStars/RatingStars';
import { Button } from '@/shared/common/ui/button';
import { Input } from '@/shared/common/ui/input';
import { Label } from '@/shared/common/ui/label';
import { Textarea } from '@/shared/common/ui/textarea';
import { Badge } from '@/shared/common/ui/badge';
import { DialogDescription, DialogHeader, DialogTitle } from '@/shared/common/ui/dialog';
import { Separator } from '@/shared/common/ui/separator';
import { Star, User, Phone, Envelope, MapPin } from '@phosphor-icons/react';
import { categoryLabels } from '@/shared/types';
import { useServiceDetail } from '@/shared/hooks/useServiceDetail';
import { useAddReview } from '@/shared/hooks/useAddReview';

export function ServiceDetailModal({ serviceId }: { serviceId: string }) {
  const { service, provider, reviews, averageRating } = useServiceDetail(serviceId);
  const addReview = useAddReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  if (!service) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    addReview.mutate({
      serviceId: service.id,
      rating,
      comment,
      authorName: authorName || undefined,
    });
    setRating(5);
    setComment('');
    setAuthorName('');
  };

  const handleContact = () => {
    window.open(`https://wa.me/55${service.whatsapp.replace(/\D/g, '')}`, '_blank');
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-serif pr-8">{service.name}</DialogTitle>
        <DialogDescription className="flex items-center gap-3 mt-2">
          <Badge variant="secondary" className="text-base px-3 py-1">
            {categoryLabels[service.category]}
          </Badge>
          {averageRating > 0 && (
            <div className="flex items-center gap-2">
              <Star size={20} weight="fill" className="text-cta" />
              <span className="font-bold text-lg text-foreground">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {service.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${service.name} ${idx + 1}`}
              className="w-full aspect-video object-cover rounded-lg"
            />
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Sobre este serviço</h3>
          <p className="text-muted-foreground leading-relaxed">{service.description}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Informações de Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User size={20} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Prestador</p>
                  <p className="font-medium">{provider?.name || 'Provedor'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone size={20} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{service.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Envelope size={20} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="font-medium text-sm">{service.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Localização</p>
                  <p className="font-medium text-sm">
                    {service.address.street}, {service.address.number} -{' '}
                    {service.address.neighborhood}, {service.address.city} - {service.address.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Avaliações dos Clientes</h3>
            <div className="bg-muted/30 rounded-lg p-5 mb-4">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-primary mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <RatingStars rating={averageRating} size={24} />
                <p className="text-sm text-muted-foreground mt-2">
                  Baseado em {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
                </p>
              </div>
              <div className="space-y-2">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-12">
                      {star} {star === 1 ? 'estrela' : 'estrelas'}
                    </span>
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cta transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-4">Comentários dos Clientes</h3>
          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-l-2 border-cta pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{review.authorName || 'Anônimo'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} size={16} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma avaliação ainda. Seja o primeiro!
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmitReview}
            className="space-y-4 p-5 bg-muted/30 rounded-lg border-2 border-dashed"
          >
            <h4 className="font-semibold">Deixe sua avaliação</h4>
            <div>
              <Label>Nome (opcional)</Label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div>
              <Label>Sua nota</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="hover:scale-125 transition-transform"
                  >
                    <Star
                      size={32}
                      weight={value <= rating ? 'fill' : 'regular'}
                      className={value <= rating ? 'text-cta' : 'text-border'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Seu comentário</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência com este serviço..."
                required
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Publicar Avaliação
            </Button>
          </form>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="font-semibold text-lg">{service.name}</p>
            <div className="flex items-center gap-2 text-sm">
              <Star size={16} weight="fill" className="text-cta" />
              <span className="font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviews.length})</span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleContact}
            className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold px-8 md:px-12"
          >
            <Phone size={20} />
            Entrar em Contato
          </Button>
        </div>
      </div>
    </>
  );
}
