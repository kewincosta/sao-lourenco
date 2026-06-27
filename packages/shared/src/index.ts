export const DOCUMENT_TYPES = ['CPF', 'CNPJ'] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
