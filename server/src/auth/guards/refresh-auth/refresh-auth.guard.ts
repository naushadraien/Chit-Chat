import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

//this file is created using the command: nest g gu auth/guards/refresh-auth
@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh-jwt') {
  handleRequest(err, user, info) {
    // If the refresh token has expired, throw a custom UnauthorizedException
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Your refresh token has expired');
    }
    // If there is an error or the user is not authenticated, throw an UnauthorizedException
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // If the user is authenticated, allow the request to proceed
    return user;
  }
}
