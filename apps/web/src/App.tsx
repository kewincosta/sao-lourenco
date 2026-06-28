import { useState, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ServiceCard } from './components/ServiceCard';
import { AttractionCard } from './components/AttractionCard';
import { RatingStars } from '@/shared/common/RatingStars/RatingStars';
import { Button } from '@/shared/common/ui/button';
import { Input } from '@/shared/common/ui/input';
import { Label } from '@/shared/common/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/common/ui/dialog';
import { Separator } from '@/shared/common/ui/separator';
import {
  MagnifyingGlass,
  MapPin,
  Star,
  Briefcase,
  TreePalm,
  ForkKnife,
  Bed,
  Camera,
  Phone,
  Envelope,
  User,
  SignOut,
  Pencil,
  Trash,
} from '@phosphor-icons/react';
import { mockUsers, mockServices, mockReviews, mockAttractions } from './lib/mock-data';
import {
  categoryLabels,
  type User as UserType,
  type Service,
  type Review,
  type ServiceCategory,
} from '@/shared/types';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<UserType | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');

  const [userServices, setUserServices] = useState<Service[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>(mockReviews);

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

  const selectedAttraction = useMemo(() => {
    return mockAttractions.find((a) => a.id === selectedAttractionId) || null;
  }, [selectedAttractionId]);

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

  const handleLogin = (document: string) => {
    const foundUser = mockUsers.find(
      (u) => u.document.replace(/\D/g, '') === document.replace(/\D/g, ''),
    );
    if (foundUser) {
      setUser(foundUser);
      setCurrentView('dashboard');
      toast.success(`Bem-vindo, ${foundUser.name}!`);
      return true;
    }
    toast.error('CPF/CNPJ não encontrado');
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    toast.success('Logout realizado com sucesso');
  };

  const handleAddReview = (
    serviceId: string,
    rating: number,
    comment: string,
    authorName?: string,
  ) => {
    const newReview: Review = {
      id: Date.now().toString(),
      serviceId,
      rating,
      comment,
      authorName,
      createdAt: new Date().toISOString(),
    };
    setAllReviews((current) => [...(current || []), newReview]);
    toast.success('Avaliação enviada com sucesso!');
  };

  const handleDeleteService = (serviceId: string) => {
    setUserServices((current) => (current || []).filter((s) => s.id !== serviceId));
    toast.success('Serviço excluído com sucesso');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} currentView={currentView} onNavigate={setCurrentView} />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage onNavigate={setCurrentView} onServiceClick={setSelectedServiceId} />
        )}
        {currentView === 'attractions' && (
          <AttractionsPage onAttractionClick={setSelectedAttractionId} />
        )}
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
        {currentView === 'login' && <LoginPage onLogin={handleLogin} />}
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
            <ServiceDetailModal
              service={selectedService}
              provider={getServiceProvider(selectedService.userId)}
              reviews={getServiceReviews(selectedService.id)}
              averageRating={getServiceAverageRating(selectedService.id)}
              onAddReview={handleAddReview}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedAttraction && (
        <Dialog open={!!selectedAttraction} onOpenChange={() => setSelectedAttractionId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <AttractionDetailModal attraction={selectedAttraction} />
          </DialogContent>
        </Dialog>
      )}

      <Toaster richColors position="top-right" />
    </div>
  );
}

function HomePage({
  onNavigate,
  onServiceClick,
}: {
  onNavigate: (view: string) => void;
  onServiceClick: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');

  const getServiceReviews = (serviceId: string) => {
    return mockReviews.filter((r) => r.serviceId === serviceId);
  };

  const getServiceAverageRating = (serviceId: string) => {
    const reviews = getServiceReviews(serviceId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  const getServiceProvider = (userId: string) => {
    const provider = mockUsers.find((u) => u.id === userId);
    return provider?.name || 'Provedor';
  };

  const featuredServices = mockServices.slice(0, 6);
  const topRatedServices = [...mockServices]
    .sort((a, b) => {
      const ratingA = getServiceAverageRating(a.id);
      const ratingB = getServiceAverageRating(b.id);
      return ratingB - ratingA;
    })
    .slice(0, 4);

  const handleSearch = () => {
    onNavigate('services');
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
                  onNavigate('services');
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
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('services')}
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
              <ServiceCard
                key={service.id}
                service={service}
                provider={getServiceProvider(service.userId)}
                averageRating={getServiceAverageRating(service.id)}
                reviewCount={getServiceReviews(service.id).length}
                onClick={() => onServiceClick(service.id)}
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
            {mockAttractions.slice(0, 3).map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} onClick={() => {}} />
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg" onClick={() => onNavigate('attractions')}>
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
            onClick={() => onNavigate('register')}
            className="bg-white text-cta hover:bg-white/90 h-14 px-10 text-lg font-semibold shadow-xl"
          >
            Anunciar Meu Negócio
          </Button>
        </div>
      </section>
    </>
  );
}

function AttractionsPage({ onAttractionClick }: { onAttractionClick: (id: string) => void }) {
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
          {mockAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              onClick={() => onAttractionClick(attraction.id)}
            />
          ))}
        </div>
      </div>
    </section>
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

function LoginPage({ onLogin }: { onLogin: (document: string) => boolean }) {
  const [document, setDocument] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(document);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Entrar</CardTitle>
            <CardDescription>Acesse sua conta com CPF ou CNPJ</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="document">CPF ou CNPJ</Label>
                <Input
                  id="document"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use qualquer CPF/CNPJ dos usuários mockados
                </p>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function RegisterPage({ onNavigate }: { onNavigate: (view: string) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cadastro realizado! Faça login para continuar.');
    onNavigate('login');
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Cadastrar Serviço</CardTitle>
            <CardDescription>Preencha os dados para começar a anunciar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reg-document">CPF ou CNPJ</Label>
                  <Input id="reg-document" placeholder="000.000.000-00" required />
                </div>
                <div>
                  <Label htmlFor="reg-name">Nome/Razão Social</Label>
                  <Input id="reg-name" placeholder="Seu nome ou empresa" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reg-email">E-mail</Label>
                  <Input id="reg-email" type="email" placeholder="seu@email.com" required />
                </div>
                <div>
                  <Label htmlFor="reg-whatsapp">WhatsApp</Label>
                  <Input id="reg-whatsapp" placeholder="(35) 99999-9999" required />
                </div>
              </div>
              <div>
                <Label htmlFor="reg-address">Endereço Completo</Label>
                <Input id="reg-address" placeholder="Rua, número, bairro, cidade - MG" required />
              </div>
              <Button type="submit" className="w-full bg-cta hover:bg-cta/90 text-cta-foreground">
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>
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

interface ServiceDetailModalProps {
  service: Service;
  provider: string;
  reviews: Review[];
  averageRating: number;
  onAddReview: (serviceId: string, rating: number, comment: string, authorName?: string) => void;
}

function ServiceDetailModal({
  service,
  provider,
  reviews,
  averageRating,
  onAddReview,
}: ServiceDetailModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview(service.id, rating, comment, authorName || undefined);
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
                  <p className="font-medium">{provider}</p>
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

function AttractionDetailModal({
  attraction,
}: {
  attraction: {
    id: string;
    name: string;
    description: string;
    category: string;
    images: string[];
    address: string;
    schedule?: string;
    entryFee?: string;
    highlights: string[];
  };
}) {
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

export default App;
