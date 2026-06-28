import { Card, CardContent } from '@/shared/common/ui/card';
import { Briefcase, Star, User } from '@phosphor-icons/react';

export function DashboardStats({
  totalServices,
  averageRating,
  totalReviews,
}: {
  totalServices: number;
  averageRating: number;
  totalReviews: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Serviços</p>
              <p className="text-3xl font-bold">{totalServices}</p>
            </div>
            <Briefcase size={40} className="text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Média de Avaliações</p>
              <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
            </div>
            <Star size={40} weight="fill" className="text-cta" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Avaliações</p>
              <p className="text-3xl font-bold">{totalReviews}</p>
            </div>
            <User size={40} className="text-secondary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
