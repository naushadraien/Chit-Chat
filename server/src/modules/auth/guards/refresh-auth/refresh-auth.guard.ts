import {
  ExecutionContext,
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export enum RefreshErrorType {
  TOKEN_EXPIRED = 'refresh_token_expired',
  TOKEN_INVALID = 'refresh_token_invalid',
  TOKEN_MISSING = 'refresh_token_missing',
  TOKEN_MALFORMED = 'refresh_token_malformed',
  DEVICE_MISMATCH = 'device_mismatch',
  SESSION_REVOKED = 'session_revoked',
  UNAUTHORIZED = 'refresh_unauthorized',
}

export interface RefreshErrorResponse {
  statusCode: number;
  errorType: RefreshErrorType;
  message: string;
  path: string;
  timestamp: string;
  requestId?: string;
  shouldRelogin?: boolean; // Hint to frontend
}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh-jwt') {
  private readonly logger = new Logger(RefreshAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.url;
    const method = request.method;

    try {
      const result = await super.canActivate(context);

      const user = request.user as any;
      this.logger.debug(
        `✅ Refresh token valid: ${user?.email || user?.id} → ${method} ${path}`,
      );

      return result as boolean;
    } catch (error) {
      this.logger.warn(
        `⚠️ Refresh token validation failed: ${method} ${path} - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request?.url || 'unknown';
    const requestId = request?.headers['x-request-id'] as string;
    const deviceId = request?.body?.deviceId;

    // Error mapping for refresh token errors
    const errorMap: Record<
      string,
      {
        type: RefreshErrorType;
        message: string;
        shouldRelogin?: boolean;
      }
    > = {
      [TokenExpiredError.name]: {
        type: RefreshErrorType.TOKEN_EXPIRED,
        message: 'Your refresh token has expired. Please log in again.',
        shouldRelogin: true,
      },
      [JsonWebTokenError.name]: {
        type: RefreshErrorType.TOKEN_INVALID,
        message: 'Invalid refresh token. Please log in again.',
        shouldRelogin: true,
      },
      'No auth token': {
        type: RefreshErrorType.TOKEN_MISSING,
        message: 'Refresh token is required.',
        shouldRelogin: true,
      },
      'jwt malformed': {
        type: RefreshErrorType.TOKEN_MALFORMED,
        message: 'Malformed refresh token.',
        shouldRelogin: true,
      },
      'Session not found': {
        type: RefreshErrorType.SESSION_REVOKED,
        message: 'Session has been revoked. Please log in again.',
        shouldRelogin: true,
      },
      'Device mismatch': {
        type: RefreshErrorType.DEVICE_MISMATCH,
        message: 'Device mismatch detected. Please log in again.',
        shouldRelogin: true,
      },
    };

    // Handle JWT-specific refresh token errors
    if (info) {
      const errorName = info.constructor?.name || info.name || info.message;
      const errorConfig = errorMap[errorName];

      if (errorConfig) {
        this.throwRefreshError(
          errorConfig.type,
          errorConfig.message,
          path,
          requestId,
          errorConfig.shouldRelogin,
          info,
        );
      }

      // Handle info message strings
      if (info.message) {
        const messageConfig = errorMap[info.message];
        if (messageConfig) {
          this.throwRefreshError(
            messageConfig.type,
            messageConfig.message,
            path,
            requestId,
            messageConfig.shouldRelogin,
            info,
          );
        }
      }
    }

    // Handle general errors
    if (err) {
      this.logger.error(
        `Refresh token error: ${err.message} (${path})`,
        err.stack,
      );

      // Check for specific error messages
      const errorMessage = err.message || '';
      const matchedError = Object.entries(errorMap).find(([key]) =>
        errorMessage.includes(key),
      );

      if (matchedError) {
        const [, config] = matchedError;
        this.throwRefreshError(
          config.type,
          config.message,
          path,
          requestId,
          config.shouldRelogin,
          err,
        );
      }

      this.throwRefreshError(
        RefreshErrorType.UNAUTHORIZED,
        'Refresh token validation failed. Please log in again.',
        path,
        requestId,
        true,
        err,
      );
    }

    // Handle missing token or user
    if (!user) {
      this.throwRefreshError(
        RefreshErrorType.TOKEN_MISSING,
        'Refresh token missing or invalid. Please log in again.',
        path,
        requestId,
        true,
      );
    }

    // Validate device ID if present
    if (deviceId && user.deviceId && user.deviceId !== deviceId) {
      this.throwRefreshError(
        RefreshErrorType.DEVICE_MISMATCH,
        'Device mismatch detected. Please log in again.',
        path,
        requestId,
        true,
      );
    }

    // Attach metadata
    if (user) {
      user._metadata = {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        requestId,
        deviceId,
      };
    }

    return user;
  }

  private throwRefreshError(
    type: RefreshErrorType,
    message: string,
    path: string,
    requestId?: string,
    shouldRelogin = false,
    error?: any,
  ): never {
    // Log with context
    const logMessage = `${type}: ${message} (${path})${requestId ? ` [${requestId}]` : ''}`;

    if (shouldRelogin) {
      this.logger.warn(`${logMessage} - User must re-authenticate`);
    } else {
      this.logger.debug(logMessage);
    }

    const response: RefreshErrorResponse = {
      statusCode: HttpStatus.UNAUTHORIZED,
      errorType: type,
      message,
      path,
      timestamp: new Date().toISOString(),
      requestId,
      shouldRelogin, // Tell frontend to redirect to login
    };

    throw new HttpException(response, HttpStatus.UNAUTHORIZED);
  }
}
