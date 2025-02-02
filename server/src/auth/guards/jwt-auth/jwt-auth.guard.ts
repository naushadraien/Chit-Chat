import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Use the Reflector to get the metadata value for the IS_PUBLIC_KEY
    // The Reflector helps to retrieve metadata set by decorators
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Check if the handler (method) has the IS_PUBLIC_KEY metadata
      context.getClass(), // Check if the class (controller) has the IS_PUBLIC_KEY metadata
    ]);

    // If the route is public, allow access without authentication
    if (isPublic) {
      return true;
    }

    // Otherwise, use the default JWT authentication guard
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // If the token has expired, throw a custom UnauthorizedException
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Your access token has expired');
    }
    // If there is an error or the user is not authenticated, throw an UnauthorizedException
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // If the user is authenticated, return the user object
    return user;
  }
}
