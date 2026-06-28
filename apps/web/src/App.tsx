import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ServiceCard } from '@/shared/domain/ServiceCard';
import { ServiceDetailModal } from '@/shared/domain/ServiceDetailModal';
import { RegisterPage } from '@/pages/Register';
import { LoginPage } from '@/pages/Login';
import { AttractionsPage } from '@/pages/Attractions';
import { HomePage } from '@/pages/Home';
import { useAuthStore } from '@/shared/stores/auth.store';
import { RatingStars } from '@/shared/common/RatingStars/RatingStars';
import { Button } from '@/shared/common/ui/button';
import { Input } from '@/shared/common/ui/input';
import { Label } from '@/shared/common/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/common/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/ui/select';
import { Textarea } from '@/shared/common/ui/textarea';
import { Badge } from '@/shared/common/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/common/ui/tabs';
import { Dialog, DialogContent } from '@/shared/common/ui/dialog';
import {
  MagnifyingGlass,
  Star,
  Briefcase,
  Phone,
  Envelope,
  User,
  SignOut,
  Pencil,
  Trash,
} from '@phosphor-icons/react';
import { mockUsers, mockServices, mockReviews } from '@/services/mock-data';
import {
  categoryLabels,
  type User as UserType,
  type Service,
  type Review,
  type ServiceCategory,
} from '@/shared/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState('home');
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');

  const [userServices, setUserServices] = useState<Service[]>([]);
  const [allReviews] = useState<Review[]>(mockReviews);

  const allServices = useMemo(() => {
    return [...mockServices, ...(userServices || [])];
  }, [userServices]);

  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [allServices, searchQuery, categoryFilter]);

  const selectedService = useMemo(() => {
    return allServices.find((s) => s.id === selectedServiceId) || null;
  }, [allServices, selectedServiceId]);

  const getServiceProvider = (userId: string) => {
    const provider = mockUsers.find((u) => u.id === userId);
    return provider?.name || 'Provedor';
  };

  const getServiceReviews = (serviceId: string) => {
    return (allReviews || []).filter((r) => r.serviceId === serviceId);
  };

  const getServiceAverageRating = (serviceId: string) => {
    const reviews = getServiceReviews(serviceId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    toast.success('Logout realizado com sucesso');
  };

  const handleDeleteService = (serviceId: string) => {
    setUserServices((current) => (current || []).filter((s) => s.id !== serviceId));
    toast.success('Serviço excluído com sucesso');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header user={user} currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1">
          {currentView === 'home' && <HomePage onNavigate={setCurrentView} />}
          {currentView === 'attractions' && <AttractionsPage />}
          {currentView === 'services' && (
            <ServicesPage
              services={filteredServices}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              onServiceClick={setSelectedServiceId}
              getServiceProvider={getServiceProvider}
              getServiceAverageRating={getServiceAverageRating}
              getServiceReviews={getServiceReviews}
            />
          )}
          {currentView === 'login' && <LoginPage onNavigate={setCurrentView} />}
          {currentView === 'register' && <RegisterPage onNavigate={setCurrentView} />}
          {currentView === 'dashboard' && user && (
            <DashboardPage
              user={user}
              userServices={userServices}
              setUserServices={setUserServices}
              allReviews={allReviews}
              onLogout={handleLogout}
              onDeleteService={handleDeleteService}
            />
          )}
        </main>

        <Footer />

        {selectedService && (
          <Dialog open={!!selectedService} onOpenChange={() => setSelectedServiceId(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <ServiceDetailModal serviceId={selectedService.id} />
            </DialogContent>
          </Dialog>
        )}

        <Toaster richColors position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

interface ServicesPageProps {
  services: Service[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: ServiceCategory | 'all';
  setCategoryFilter: (category: ServiceCategory | 'all') => void;
  onServiceClick: (id: string) => void;
  getServiceProvider: (userId: string) => string;
  getServiceAverageRating: (serviceId: string) => number;
  getServiceReviews: (serviceId: string) => Review[];
}

function ServicesPage({
  services,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  onServiceClick,
  getServiceProvider,
  getServiceAverageRating,
  getServiceReviews,
}: ServicesPageProps) {
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

        {services.length === 0 ? (
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
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                provider={getServiceProvider(service.userId)}
                averageRating={getServiceAverageRating(service.id)}
                reviewCount={getServiceReviews(service.id).length}
                onClick={() => onServiceClick(service.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface DashboardPageProps {
  user: UserType;
  userServices: Service[] | undefined;
  setUserServices: (updater: (current: Service[] | undefined) => Service[]) => void;
  allReviews: Review[] | undefined;
  onLogout: () => void;
  onDeleteService: (id: string) => void;
}

function DashboardPage({
  user,
  userServices,
  setUserServices,
  allReviews,
  onLogout,
  onDeleteService,
}: DashboardPageProps) {
  const myServices = [...mockServices.filter((s) => s.userId === user.id), ...(userServices || [])];
  const myReviews = (allReviews || []).filter((r) => myServices.some((s) => s.id === r.serviceId));
  const avgRating =
    myReviews.length > 0 ? myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length : 0;

  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'guide' as ServiceCategory,
    whatsapp: user.whatsapp,
    email: user.email,
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const service: Service = {
      id: Date.now().toString(),
      userId: user.id,
      name: newService.name,
      description: newService.description,
      category: newService.category,
      images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'],
      whatsapp: newService.whatsapp,
      email: newService.email,
      address: user.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserServices((current) => [...(current || []), service]);
    setShowAddService(false);
    setNewService({
      name: '',
      description: '',
      category: 'guide',
      whatsapp: user.whatsapp,
      email: user.email,
    });
    toast.success('Serviço adicionado com sucesso!');
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo, {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <SignOut size={20} />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Serviços</p>
                  <p className="text-3xl font-bold">{myServices.length}</p>
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
                  <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
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
                  <p className="text-3xl font-bold">{myReviews.length}</p>
                </div>
                <User size={40} className="text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

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
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Novo Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddService} className="space-y-4">
                    <div>
                      <Label htmlFor="service-name">Nome do Serviço</Label>
                      <Input
                        id="service-name"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-description">Descrição</Label>
                      <Textarea
                        id="service-description"
                        value={newService.description}
                        onChange={(e) =>
                          setNewService({ ...newService, description: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-category">Categoria</Label>
                      <Select
                        value={newService.category}
                        onValueChange={(value) =>
                          setNewService({ ...newService, category: value as ServiceCategory })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddService(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {myServices.map((service) => (
                <Card key={service.id}>
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
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => onDeleteService(service.id)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <h2 className="text-2xl font-serif font-bold mb-6">Avaliações Recebidas</h2>
            <div className="space-y-4">
              {myReviews.map((review) => {
                const service = myServices.find((s) => s.id === review.serviceId);
                return (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{review.authorName || 'Anônimo'}</p>
                          <p className="text-sm text-muted-foreground">{service?.name}</p>
                        </div>
                        <RatingStars rating={review.rating} />
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default App;
