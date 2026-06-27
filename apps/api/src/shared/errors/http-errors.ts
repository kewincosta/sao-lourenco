import { AppError } from './app-error';

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400, 'Bad Request');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'Unauthorized');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'Not Found');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, 'Conflict');
  }
}
