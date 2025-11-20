import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // Basic request essentials
    const { ip, method, originalUrl } = req;
    const requestId = uuidv4().split('-')[0]; // Shorter ID for cleaner logs
    const userAgent = this.truncate(req.get('user-agent') || '-');
    const startTime = Date.now();

    // Add request tracking ID to response headers
    res.setHeader('X-Request-ID', requestId);

    // Clean request log format for all requests
    this.logger.log(
      `➡️ ${method} ${this.formatUrl(originalUrl)} [${requestId}] - ${ip} - ${userAgent}`,
    );

    // Only log bodies for write operations, with sensitive data handling
    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
      const sanitizedBody = this.sanitizeBody(req.body);
      this.logger.debug(
        `📦 [${requestId}] Body: ${JSON.stringify(sanitizedBody)}`,
      );
    }

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      const size = res.get('content-length') || '0';

      // Use appropriate log level based on status code
      const logFn = this.getLogFunctionForStatus(statusCode);
      const statusEmoji = this.getStatusEmoji(statusCode);

      logFn.call(
        this.logger,
        `${statusEmoji} ${method} ${this.formatUrl(originalUrl)} [${requestId}] - ${statusCode} - ${size} bytes - ${duration}ms`,
      );

      // Performance warning for slow requests (but only in non-production)
      if (duration > 1000 && process.env.NODE_ENV !== 'production') {
        this.logger.warn(
          `⚠️ Slow request! [${requestId}] ${duration}ms - ${method} ${originalUrl}`,
        );
      }
    });

    next();
  }

  /**
   * Formats URL for cleaner logging (trims API prefix)
   */
  private formatUrl(url: string): string {
    return url.replace('/api/v1', '');
  }

  /**
   * Truncates long strings for cleaner logs
   */
  private truncate(str: string, length = 30): string {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  }

  /**
   * Determines which logger function to use based on status code
   */
  private getLogFunctionForStatus(status: number) {
    if (status >= 500) return this.logger.error;
    if (status >= 400) return this.logger.warn;
    return this.logger.log;
  }

  /**
   * Returns an appropriate emoji for the HTTP status
   */
  private getStatusEmoji(status: number): string {
    if (status >= 500) return '❌'; // Server error
    if (status >= 400) return '⚠️'; // Client error
    if (status >= 300) return '↪️'; // Redirect
    if (status >= 200) return '✅'; // Success
    return '❓'; // Other
  }

  /**
   * Sanitizes request body to hide sensitive information
   */
  private sanitizeBody(body: any): any {
    if (!body) return {};

    // Create a shallow copy to avoid mutating the original
    const sanitized = { ...body };

    // List of fields to redact
    const sensitiveFields = [
      'password',
      'confirmPassword',
      'currentPassword',
      'newPassword',
      'token',
      'refreshToken',
      'apiKey',
      'secret',
      'authorization',
    ];

    // Redact sensitive information
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
