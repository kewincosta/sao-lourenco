/**
 * Erro base da aplicação. Carrega o status HTTP que o error handler global
 * traduz na resposta. Subclasses em `http-errors.ts`.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400, name = 'AppError') {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
