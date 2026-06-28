export type DocumentType = 'CPF' | 'CNPJ';

export interface User {
  id: string;
  document: string;
  documentType: DocumentType;
  name: string;
  email: string;
  whatsapp: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export type ServiceCategory =
  | 'guide'
  | 'restaurant'
  | 'hotel'
  | 'inn'
  | 'tour-agency'
  | 'crafts'
  | 'transport'
  | 'photography'
  | 'events';

export interface Service {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: ServiceCategory;
  images: string[];
  whatsapp: string;
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  serviceId: string;
  rating: number;
  comment: string;
  authorName?: string;
  createdAt: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'culture' | 'adventure' | 'wellness';
  images: string[];
  address: string;
  schedule?: string;
  entryFee?: string;
  highlights: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (document: string) => Promise<boolean>;
  logout: () => void;
}

export const categoryLabels: Record<ServiceCategory, string> = {
  guide: 'Guia Turístico',
  restaurant: 'Restaurante',
  hotel: 'Hotel',
  inn: 'Pousada',
  'tour-agency': 'Agência de Passeios',
  crafts: 'Artesanato',
  transport: 'Transporte Turístico',
  photography: 'Fotografia',
  events: 'Eventos',
};

export const attractionCategoryLabels: Record<Attraction['category'], string> = {
  nature: 'Natureza',
  culture: 'Cultura',
  adventure: 'Aventura',
  wellness: 'Bem-estar',
};
