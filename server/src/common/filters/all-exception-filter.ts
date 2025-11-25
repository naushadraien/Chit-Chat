import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error?: string;
  errors?: unknown[];
  requestId?: string;
  stack?: string;
  [key: string]: unknown; // Allow additional fields
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorName = 'InternalServerError';
    let validationErrors: any[] | undefined;
    let customFields: any = {}; // Store custom fields

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;

        // Extract ALL fields from the custom response
        customFields = { ...responseObj };

        message = responseObj.message || exception.message;
        errorName = responseObj.error || exception.name;

        // Handle validation errors
        if (Array.isArray(responseObj.message)) {
          validationErrors = responseObj.message;
          message = 'Validation failed';
        }
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof MongooseError.ValidationError) {
      // Handle Mongoose validation errors
      status = HttpStatus.BAD_REQUEST;
      errorName = 'ValidationError';
      message = 'Database validation failed';
      validationErrors = Object.values(exception.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));
    } else if (exception instanceof MongooseError.CastError) {
      // Handle Mongoose cast errors (invalid ObjectId, etc.)
      status = HttpStatus.BAD_REQUEST;
      errorName = 'CastError';
      message = `Invalid ${exception.path}: ${exception.value}`;
    } else if (exception instanceof Error) {
      // Handle generic errors
      message = exception.message;
      errorName = exception.name;
    }

    // Build response with custom fields preserved
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: errorName,
      requestId: request.headers['x-request-id'] as string,
      ...customFields, // Spread all custom fields (including errorType)
    };

    // Add validation errors if present
    if (validationErrors) {
      errorResponse.errors = validationErrors;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    // Structured logging
    const logContext = {
      requestId: errorResponse.requestId,
      method: request.method,
      url: request.url,
      statusCode: status,
      errorName,
      errorType: (customFields as any).errorType, // Log errorType
      userId: (request as any).user?.id,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    };

    // Log with appropriate level
    if (status >= 500) {
      this.logger.error(
        {
          ...logContext,
          message,
          stack: exception instanceof Error ? exception.stack : undefined,
        },
        `Server Error: ${message}`,
      );
    } else if (status >= 400) {
      this.logger.warn(
        {
          ...logContext,
          message,
          validationErrors,
        },
        `Client Error: ${message}`,
      );
    } else {
      this.logger.log(logContext, message);
    }

    response.status(status).json(errorResponse);
  }
}
