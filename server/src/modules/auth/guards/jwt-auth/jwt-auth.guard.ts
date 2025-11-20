import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator';

export enum AuthErrorType {
  TOKEN_EXPIRED = 'token_expired',
  TOKEN_INVALID = 'token_invalid',
  TOKEN_MISSING = 'token_missing',
  TOKEN_MALFORMED = 'token_malformed',
  SESSION_INVALID = 'session_invalid',
  UNAUTHORIZED = 'unauthorized',
}

export interface AuthErrorResponse {
  statusCode: number;
  errorType: AuthErrorType;
  message: string;
  path: string;
  timestamp: string;
  requestId?: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Extract request for logging
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.url;
    const method = request.method;

    try {
      const result = await super.canActivate(context);

      // Log successful authentication
      const user = request.user as any;
      this.logger.debug(
        `✅ Auth success: ${user?.email || user?.id} → ${method} ${path}`,
      );

      return result as boolean;
    } catch (error) {
      // Log authentication failure
      this.logger.warn(
        `⚠️ Auth failed: ${method} ${path} - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request?.url || 'unknown';
    const requestId = request?.headers['x-request-id'] as string;

    // Error mapping for better error messages
    const errorMap: Record<string, { type: AuthErrorType; message: string }> = {
      [TokenExpiredError.name]: {
        type: AuthErrorType.TOKEN_EXPIRED,
        message: 'Your session has expired. Please log in again.',
      },
      [JsonWebTokenError.name]: {
        type: AuthErrorType.TOKEN_INVALID,
        message: 'Invalid authentication token provided.',
      },
      'No auth token': {
        type: AuthErrorType.TOKEN_MISSING,
        message: 'Authentication token is required.',
      },
      'invalid signature': {
        type: AuthErrorType.TOKEN_INVALID,
        message: 'Token signature verification failed.',
      },
      'jwt malformed': {
        type: AuthErrorType.TOKEN_MALFORMED,
        message: 'Malformed authentication token.',
      },
    };

    // Handle JWT-specific errors
    if (info) {
      const errorName = info.constructor?.name || info.name || info.message;
      const errorConfig = errorMap[errorName];

      if (errorConfig) {
        this.throwAuthError(
          errorConfig.type,
          errorConfig.message,
          path,
          requestId,
          info,
        );
      }

      // Handle other info messages
      if (info.message) {
        const messageConfig = errorMap[info.message];
        if (messageConfig) {
          this.throwAuthError(
            messageConfig.type,
            messageConfig.message,
            path,
            requestId,
            info,
          );
        }
      }
    }

    // Handle general auth errors
    if (err) {
      this.logger.error(`Auth error: ${err.message} (${path})`, err.stack);

      this.throwAuthError(
        AuthErrorType.UNAUTHORIZED,
        err.message || 'Authentication failed',
        path,
        requestId,
        err,
      );
    }

    // Handle missing or invalid user
    if (!user) {
      this.throwAuthError(
        AuthErrorType.TOKEN_MISSING,
        'Authentication token missing or invalid',
        path,
        requestId,
      );
    }

    // Attach request metadata to user object for logging
    if (user) {
      user._metadata = {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        requestId,
      };
    }

    return user;
  }

  private throwAuthError(
    type: AuthErrorType,
    message: string,
    path: string,
    requestId?: string,
    error?: any,
  ): never {
    // Log with appropriate level
    const logMessage = `${type}: ${message} (${path})${requestId ? ` [${requestId}]` : ''}`;

    if (type === AuthErrorType.TOKEN_EXPIRED) {
      this.logger.debug(logMessage); // Token expiration is expected
    } else {
      this.logger.warn(logMessage);
    }

    const response: AuthErrorResponse = {
      statusCode: HttpStatus.UNAUTHORIZED,
      errorType: type,
      message,
      path,
      timestamp: new Date().toISOString(),
      requestId,
    };

    throw new HttpException(response, HttpStatus.UNAUTHORIZED);
  }
}
