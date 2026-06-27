import axios from 'axios';

/**
 * Instância Axios pré-configurada para integrações externas futuras.
 * Ainda não é consumida por nenhum endpoint nesta POC.
 */
export const httpClient = axios.create({
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});
