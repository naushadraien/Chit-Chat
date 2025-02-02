import { ExecutionContext, Injectable } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard extends AuthGuard('ws-jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return super.canActivate(context) as Promise<boolean>;
    } catch (err) {
      throw new WsException('Invalid credentials');
    }
  }

  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError) {
      throw new WsException('Your access token has expired');
    }
    if (err || !user) {
      throw new WsException('Unauthorized access');
    }
    return user;
  }
}
