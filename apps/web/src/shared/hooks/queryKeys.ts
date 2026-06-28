export const queryKeys = {
  services: ['services'] as const,
  service: (id: string) => ['services', id] as const,
  reviews: (serviceId: string) => ['reviews', serviceId] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  attractions: ['attractions'] as const,
};
