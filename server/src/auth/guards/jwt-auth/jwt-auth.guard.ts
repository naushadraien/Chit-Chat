import {
  ExecutionContext,
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';
import { Request } from 'express';

export enum AuthErrorType {
  TOKEN_EXPIRED = 'token_expired',
  TOKEN_INVALID = 'token_invalid',
  TOKEN_MISSING = 'token_missing',
  UNAUTHORIZED = 'unauthorized',
}

export interface AuthErrorResponse {
  statusCode: number;
  errorType: AuthErrorType;
  message: string;
  path: string;
  timestamp: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('Auth');

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || super.canActivate(context)
    );
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const path = context.switchToHttp().getRequest<Request>()?.url || 'unknown';

    // Handle JWT errors using map-based approach to reduce repetition
    const errorMap = {
      [TokenExpiredError.name]: {
        type: AuthErrorType.TOKEN_EXPIRED,
        message: 'Authentication token has expired',
      },
      [JsonWebTokenError.name]: {
        type: AuthErrorType.TOKEN_INVALID,
        message: 'Invalid authentication token',
      },
    };

    // Check for JWT-specific errors
    if (info) {
      const errorConfig = errorMap[info.constructor.name];
      if (errorConfig) {
        this.createAndThrowError(errorConfig.type, errorConfig.message, path);
      }
    }

    // Handle general auth errors
    if (!user) {
      this.createAndThrowError(
        AuthErrorType.TOKEN_MISSING,
        'Authentication token missing or invalid',
        path,
      );
    }

    if (err) {
      this.createAndThrowError(
        AuthErrorType.UNAUTHORIZED,
        err.message || 'Unauthorized',
        path,
      );
    }

    this.logger.debug(`Auth: ${user.email || user.id} → ${path}`);
    return user;
  }

  private createAndThrowError(
    type: AuthErrorType,
    message: string,
    path: string,
  ): never {
    this.logger.warn(`${type}: ${message} (${path})`);

    const response: AuthErrorResponse = {
      statusCode: HttpStatus.UNAUTHORIZED,
      errorType: type,
      message,
      path,
      timestamp: new Date().toISOString(),
    };

    throw new HttpException(response, HttpStatus.UNAUTHORIZED);
  }
}
