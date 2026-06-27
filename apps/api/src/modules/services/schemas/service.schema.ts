import { z } from 'zod';

export const createServiceSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(2).max(150),
  description: z.string().min(1),
  category: z.string().min(2).max(80),
  price: z.number().nonnegative(),
  city: z.string().min(1).max(120),
  state: z.string().length(2),
});

export const updateServiceSchema = z
  .object({
    title: z.string().min(2).max(150).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(2).max(80).optional(),
    price: z.number().nonnegative().optional(),
    city: z.string().min(1).max(120).optional(),
    state: z.string().length(2).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const listServiceQuerySchema = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
});

export const serviceIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ListServiceFilters = z.infer<typeof listServiceQuerySchema>;
