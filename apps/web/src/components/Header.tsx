import { useState } from 'react';
import { House, MapPin, Briefcase, UserCircle, List, X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useKV } from '@github/spark/hooks';
import type { User } from '@/lib/types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const [user] = useKV<User | null>('auth-user', null);
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Início', view: 'home', icon: House },
    { name: 'Serviços', view: 'services', icon: Briefcase },
    { name: 'Atrações', view: 'attractions', icon: MapPin },
  ];

  const handleNavigate = (view: string) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <MapPin size={28} weight="fill" className="text-primary-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-serif text-2xl font-bold leading-tight text-primary">
                São Lourenço
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Descubra experiências únicas
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.view}
                  variant="ghost"
                  onClick={() => handleNavigate(item.view)}
                  className={`text-base ${currentView === item.view ? 'bg-accent/10 text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                >
                  <Icon size={20} />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate('dashboard')}
                  className="text-base"
                >
                  <UserCircle size={20} />
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate('login')}
                  className="text-base"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => handleNavigate('register')}
                  className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold"
                >
                  Anunciar Serviço
                </Button>
              </>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                {isOpen ? <X size={24} /> : <List size={24} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.view}
                      variant={currentView === item.view ? 'default' : 'ghost'}
                      onClick={() => handleNavigate(item.view)}
                      className="justify-start"
                    >
                      <Icon size={20} />
                      {item.name}
                    </Button>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <Button
                      variant="outline"
                      onClick={() => handleNavigate('dashboard')}
                      className="w-full justify-start"
                    >
                      <UserCircle size={20} />
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleNavigate('login')}
                        className="w-full mb-2"
                      >
                        Entrar
                      </Button>
                      <Button
                        onClick={() => handleNavigate('register')}
                        className="w-full bg-cta hover:bg-cta/90 text-cta-foreground"
                      >
                        Anunciar Serviço
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
