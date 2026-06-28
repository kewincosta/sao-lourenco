import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/shared/common/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/common/ui/tabs';
import { SignOut } from '@phosphor-icons/react';
import { useAuthStore } from '@/shared/stores/auth.store';
import { getAverageRating } from '@/shared/utils/rating';
import { useMyServices } from './hooks/useMyServices';
import { useMyReviews } from './hooks/useMyReviews';
import { useCreateService } from './hooks/useCreateService';
import { useDeleteService } from './hooks/useDeleteService';
import { DashboardStats } from './components/DashboardStats';
import { AddServiceForm } from './components/AddServiceForm';
import { ServiceListItem } from './components/ServiceListItem';
import { ReviewListItem } from './components/ReviewListItem';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [showAddService, setShowAddService] = useState(false);

  const { data: myServices = [] } = useMyServices(user?.id ?? '');
  const { data: myReviews = [] } = useMyReviews(myServices);
  const createService = useCreateService();
  const deleteService = useDeleteService();

  if (!user) return null;

  const averageRating = getAverageRating(myReviews.map((r) => r.rating));

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logout realizado com sucesso');
  };

  const handleAddService = (input: {
    name: string;
    description: string;
    category: (typeof myServices)[number]['category'];
    whatsapp: string;
    email: string;
  }) => {
    createService.mutate({
      ...input,
      userId: user.id,
      images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'],
      address: user.address,
    });
    setShowAddService(false);
    toast.success('Serviço adicionado com sucesso!');
  };

  const handleDeleteService = (id: string) => {
    deleteService.mutate(id);
    toast.success('Serviço excluído com sucesso');
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo, {user.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <SignOut size={20} />
            Sair
          </Button>
        </div>

        <DashboardStats
          totalServices={myServices.length}
          averageRating={averageRating}
          totalReviews={myReviews.length}
        />

        <Tabs defaultValue="services">
          <TabsList className="mb-6">
            <TabsTrigger value="services">Meus Serviços</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações Recebidas</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Meus Serviços</h2>
              <Button onClick={() => setShowAddService(true)} className="bg-cta hover:bg-cta/90">
                Adicionar Serviço
              </Button>
            </div>

            {showAddService && (
              <AddServiceForm
                defaultWhatsapp={user.whatsapp}
                defaultEmail={user.email}
                onSubmit={handleAddService}
                onCancel={() => setShowAddService(false)}
              />
            )}

            <div className="space-y-4">
              {myServices.map((service) => (
                <ServiceListItem
                  key={service.id}
                  service={service}
                  onDelete={handleDeleteService}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <h2 className="text-2xl font-serif font-bold mb-6">Avaliações Recebidas</h2>
            <div className="space-y-4">
              {myReviews.map((review) => {
                const service = myServices.find((s) => s.id === review.serviceId);
                return (
                  <ReviewListItem key={review.id} review={review} serviceName={service?.name} />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
