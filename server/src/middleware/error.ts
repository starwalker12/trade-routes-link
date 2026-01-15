import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    const response: { error: string; code?: string } = { error: err.message };
    if (err.code) {
      response.code = err.code;
    }
    res.status(err.statusCode).json(response);
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
