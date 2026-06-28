import { useServices } from '@/shared/hooks/useServices';

export function useMyServices(userId: string) {
  const query = useServices();
  const myServices = (query.data ?? []).filter((service) => service.userId === userId);

  return { ...query, data: myServices };
}
