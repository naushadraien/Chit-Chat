import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

export enum RefreshErrorType {
  TOKEN_EXPIRED = 'refresh_token_expired',
  TOKEN_INVALID = 'refresh_token_invalid',
  TOKEN_MISSING = 'refresh_token_missing',
  UNAUTHORIZED = 'refresh_unauthorized',
}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh-jwt') {
  private readonly logger = new Logger('RefreshAuth');

  handleRequest(err, user, info, context) {
    const path = context?.switchToHttp().getRequest()?.url || 'unknown';

    // Handle refresh token errors using the map pattern
    const errorMap = {
      [TokenExpiredError.name]: {
        type: RefreshErrorType.TOKEN_EXPIRED,
        message: 'Refresh token has expired. Please log in again.',
      },
      [JsonWebTokenError.name]: {
        type: RefreshErrorType.TOKEN_INVALID,
        message: 'Invalid refresh token',
      },
    };

    // Check for JWT-specific refresh token errors
    if (info) {
      const errorConfig = errorMap[info.constructor.name];
      if (errorConfig) {
        this.throwRefreshError(errorConfig.type, errorConfig.message, path);
      }
    }

    // Handle missing token or general errors
    if (!user) {
      this.throwRefreshError(
        RefreshErrorType.TOKEN_MISSING,
        'Refresh token missing or invalid',
        path,
      );
    }

    if (err) {
      this.throwRefreshError(
        RefreshErrorType.UNAUTHORIZED,
        err.message || 'Refresh token validation failed',
        path,
      );
    }

    this.logger.debug(`Refresh token valid: ${user.email || user.sub}`);
    return user;
  }

  private throwRefreshError(
    type: RefreshErrorType,
    message: string,
    path: string,
  ): never {
    this.logger.warn(`${type}: ${message} (${path})`);

    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        errorType: type,
        message,
        path,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
