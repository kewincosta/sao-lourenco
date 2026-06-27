import { z } from 'zod';
import { DOCUMENT_TYPES } from '@sao-lourenco/shared';
import { isValidDocument } from '../../../shared/utils/document';

export const createUserSchema = z
  .object({
    name: z.string().min(2).max(150),
    document: z.string().min(11).max(18),
    documentType: z.enum(DOCUMENT_TYPES),
    email: z.string().email().max(255),
    whatsapp: z.string().min(8).max(20),
    address: z.string().min(1).max(255),
  })
  // A validação de dígitos verificadores depende do tipo, por isso o refine no objeto.
  .refine((data) => isValidDocument(data.document, data.documentType), {
    message: 'Invalid CPF/CNPJ',
    path: ['document'],
  });

export const authUserSchema = z.object({
  document: z.string().min(11).max(18),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(150).optional(),
    email: z.string().email().max(255).optional(),
    whatsapp: z.string().min(8).max(20).optional(),
    address: z.string().min(1).max(255).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type AuthUserInput = z.infer<typeof authUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
