import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { House, MapPin, Briefcase, UserCircle, List, X } from '@phosphor-icons/react';
import { Button } from '@/shared/common/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/common/ui/sheet';
import { useAuthStore } from '@/shared/stores/auth.store';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const navigation = [
    { name: 'Início', path: '/', icon: House },
    { name: 'Serviços', path: '/servicos', icon: Briefcase },
    { name: 'Atrações', path: '/atracoes', icon: MapPin },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <button
            onClick={() => handleNavigate('/')}
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
                <Button key={item.path} variant="ghost" asChild className="text-base">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-accent/10 text-primary font-semibold'
                        : 'text-foreground hover:text-primary'
                    }
                  >
                    <Icon size={20} />
                    {item.name}
                  </NavLink>
                </Button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigate('/dashboard')}
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
                  onClick={() => handleNavigate('/login')}
                  className="text-base"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => handleNavigate('/cadastro')}
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
                      key={item.path}
                      variant="ghost"
                      onClick={() => handleNavigate(item.path)}
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
                      onClick={() => handleNavigate('/dashboard')}
                      className="w-full justify-start"
                    >
                      <UserCircle size={20} />
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleNavigate('/login')}
                        className="w-full mb-2"
                      >
                        Entrar
                      </Button>
                      <Button
                        onClick={() => handleNavigate('/cadastro')}
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
