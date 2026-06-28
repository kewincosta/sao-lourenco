import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RegisterPage } from '@/pages/Register';
import { LoginPage } from '@/pages/Login';
import { AttractionsPage } from '@/pages/Attractions';
import { HomePage } from '@/pages/Home';
import { ServicesPage } from '@/pages/Services';
import { DashboardPage } from '@/pages/Dashboard';
import { useAuthStore } from '@/shared/stores/auth.store';

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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header user={user} currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1">
          {currentView === 'home' && <HomePage onNavigate={setCurrentView} />}
          {currentView === 'attractions' && <AttractionsPage />}
          {currentView === 'services' && <ServicesPage />}
          {currentView === 'login' && <LoginPage onNavigate={setCurrentView} />}
          {currentView === 'register' && <RegisterPage onNavigate={setCurrentView} />}
          {currentView === 'dashboard' && user && <DashboardPage onNavigate={setCurrentView} />}
        </main>

        <Footer />

        <Toaster richColors position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
