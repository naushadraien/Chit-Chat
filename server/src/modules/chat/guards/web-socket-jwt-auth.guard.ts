import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken';

export enum WsAuthErrorCode {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_MISSING = 'TOKEN_MISSING',
  TOKEN_MALFORMED = 'TOKEN_MALFORMED',
  TOKEN_NOT_ACTIVE = 'TOKEN_NOT_ACTIVE',
  SESSION_INVALID = 'SESSION_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  AUTH_ERROR = 'AUTH_ERROR',
}

export interface WsAuthError {
  message: string;
  code: WsAuthErrorCode;
  timestamp: string;
  socketId: string;
  shouldReconnect?: boolean;
  details?: any;
}

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('ws-jwt') implements CanActivate {
  private readonly logger = new Logger(WsJwtAuthGuard.name);

  // Override canActivate for better error handling
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();

    try {
      const result = (await super.canActivate(context)) as boolean;

      if (result) {
        const user = client.data.user;
        this.logger.log(
          `✅ WebSocket auth success: User ${user?.id} connected on socket ${client.id} from ${client.handshake.address}`,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(
        `❌ WebSocket authentication failed for socket ${client.id} from ${client.handshake.address}`,
        error instanceof Error ? error.stack : error,
      );

      // Build structured error response
      const errorResponse = this.buildErrorResponse(error, client);

      // Emit error event to client before disconnecting
      client.emit('auth:error', errorResponse);

      // Give client time to receive error before disconnect
      setTimeout(() => {
        client.disconnect(true);
      }, 100);

      return false;
    }
  }

  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();

    // Attach handshake for token extraction
    return {
      handshake: client.handshake,
    };
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const socketId = client.id;
    const ipAddress = client.handshake.address;

    // Map of error types to structured responses
    const errorMap: Record<
      string,
      { code: WsAuthErrorCode; message: string; shouldReconnect?: boolean }
    > = {
      [TokenExpiredError.name]: {
        code: WsAuthErrorCode.TOKEN_EXPIRED,
        message: 'Your access token has expired. Please refresh your token.',
        shouldReconnect: true,
      },
      [JsonWebTokenError.name]: {
        code: WsAuthErrorCode.TOKEN_INVALID,
        message: 'Invalid access token provided.',
        shouldReconnect: false,
      },
      [NotBeforeError.name]: {
        code: WsAuthErrorCode.TOKEN_NOT_ACTIVE,
        message: 'Token is not yet active.',
        shouldReconnect: true,
      },
      'jwt malformed': {
        code: WsAuthErrorCode.TOKEN_MALFORMED,
        message: 'Malformed access token.',
        shouldReconnect: false,
      },
      'No auth token': {
        code: WsAuthErrorCode.TOKEN_MISSING,
        message: 'Authentication token is required.',
        shouldReconnect: false,
      },
      'Session not found': {
        code: WsAuthErrorCode.SESSION_INVALID,
        message: 'Session has been revoked. Please log in again.',
        shouldReconnect: false,
      },
    };

    // Handle specific JWT errors from info
    if (info) {
      const errorName = info.constructor?.name || info.name || info.message;
      const errorConfig = errorMap[errorName] || errorMap[info.message];

      if (errorConfig) {
        this.logger.warn(
          `⚠️ ${errorConfig.code} for socket ${socketId} - IP: ${ipAddress}`,
        );

        throw new WsException({
          message: errorConfig.message,
          code: errorConfig.code,
          timestamp: new Date().toISOString(),
          socketId,
          shouldReconnect: errorConfig.shouldReconnect,
        });
      }
    }

    // Handle general errors
    if (err) {
      this.logger.error(
        `❌ Authentication error for socket ${socketId} - IP: ${ipAddress}`,
        err.stack || err,
      );

      // Check if error message matches known patterns
      const errorMessage = err.message || '';
      const matchedError = Object.entries(errorMap).find(([key]) =>
        errorMessage.toLowerCase().includes(key.toLowerCase()),
      );

      if (matchedError) {
        const [, config] = matchedError;
        throw new WsException({
          message: config.message,
          code: config.code,
          timestamp: new Date().toISOString(),
          socketId,
          shouldReconnect: config.shouldReconnect,
          details:
            process.env.NODE_ENV !== 'production' ? err.message : undefined,
        });
      }

      throw new WsException({
        message: 'Authentication failed',
        code: WsAuthErrorCode.AUTH_ERROR,
        timestamp: new Date().toISOString(),
        socketId,
        shouldReconnect: false,
        details:
          process.env.NODE_ENV !== 'production' ? err.message : undefined,
      });
    }

    // Handle missing user
    if (!user) {
      this.logger.warn(
        `⚠️ No user found for socket ${socketId} - IP: ${ipAddress}`,
      );

      throw new WsException({
        message: 'Unauthorized access - user not found',
        code: WsAuthErrorCode.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
        socketId,
        shouldReconnect: false,
      });
    }

    // ✅ Attach user and metadata to socket data for later use
    client.data.user = user;
    client.data.authenticatedAt = new Date();
    client.data.ipAddress = ipAddress;

    this.logger.log(
      `✅ User ${user.id} (${user.email || 'no email'}) authenticated on socket ${socketId}`,
    );

    return user;
  }

  private buildErrorResponse(error: any, client: Socket): WsAuthError {
    const baseError: WsAuthError = {
      message: this.getErrorMessage(error),
      code: this.getErrorCode(error),
      timestamp: new Date().toISOString(),
      socketId: client.id,
      shouldReconnect: this.shouldReconnect(error),
    };

    // Add details in development
    if (process.env.NODE_ENV !== 'production' && error instanceof Error) {
      baseError.details = {
        name: error.name,
        message: error.message,
      };
    }

    return baseError;
  }

  private getErrorMessage(error: any): string {
    if (error instanceof TokenExpiredError) {
      return 'Your access token has expired. Please refresh your token.';
    }
    if (error instanceof JsonWebTokenError) {
      return 'Invalid access token provided.';
    }
    if (error instanceof NotBeforeError) {
      return 'Token is not yet active.';
    }
    if (error instanceof WsException) {
      const wsError = error.getError();
      return typeof wsError === 'string' ? wsError : (wsError as any).message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Authentication failed. Please try again.';
  }

  private getErrorCode(error: any): WsAuthErrorCode {
    if (error instanceof TokenExpiredError) {
      return WsAuthErrorCode.TOKEN_EXPIRED;
    }
    if (error instanceof JsonWebTokenError) {
      if (error.message.includes('malformed')) {
        return WsAuthErrorCode.TOKEN_MALFORMED;
      }
      return WsAuthErrorCode.TOKEN_INVALID;
    }
    if (error instanceof NotBeforeError) {
      return WsAuthErrorCode.TOKEN_NOT_ACTIVE;
    }
    if (error instanceof WsException) {
      const wsError = error.getError() as any;
      return wsError.code || WsAuthErrorCode.AUTH_ERROR;
    }
    return WsAuthErrorCode.AUTH_ERROR;
  }

  private shouldReconnect(error: any): boolean {
    // Token expired - client should refresh and reconnect
    if (error instanceof TokenExpiredError) {
      return true;
    }
    // Not yet active - client can retry later
    if (error instanceof NotBeforeError) {
      return true;
    }
    // Invalid/malformed tokens - don't retry
    if (error instanceof JsonWebTokenError) {
      return false;
    }
    // Unknown errors - don't retry automatically
    return false;
  }
}
