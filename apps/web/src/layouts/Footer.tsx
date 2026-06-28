import { MapPin } from '@phosphor-icons/react';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <MapPin size={24} weight="fill" className="text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold text-primary">São Lourenço</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Conectando visitantes aos melhores profissionais e experiências de São Lourenço - MG.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Para Visitantes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">
                Buscar Serviços
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Atrações Turísticas
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">Como Chegar</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Para Prestadores</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">
                Anunciar Serviço
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">Entrar</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Criar Conta</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} São Lourenço Marketplace. Conectando visitantes e
            prestadores de serviços.
          </p>
        </div>
      </div>
    </footer>
  );
}
