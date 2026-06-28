import type { Service, ServiceCategory } from '@/shared/types';

export function filterServices(
  services: Service[],
  { search, category }: { search: string; category: ServiceCategory | 'all' },
): Service[] {
  return services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || service.category === category;
    return matchesSearch && matchesCategory;
  });
}
