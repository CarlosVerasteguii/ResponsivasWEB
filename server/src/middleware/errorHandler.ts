import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.error('Error no controlado:', err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: 'Error interno del servidor.',
        // Only expose error details in development environment
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        // Optionally add stack trace in development for more detail
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
}; 