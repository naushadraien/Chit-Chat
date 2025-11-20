import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthJWTPayload } from '../types/auth.jwtPayload';
import { AuthService } from '../auth.service';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Socket } from 'socket.io';

interface WsRequest {
  handshake: Socket['handshake'];
}

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (req: WsRequest) => {
        if (!req?.handshake?.headers?.authorization) {
          throw new Error('No token found');
        }
        const token = req.handshake.headers.authorization.split(' ')[1];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret as string,
    });
  }

  async validate(payload: AuthJWTPayload) {
    const userId = payload.sub;
    const user = await this.authService.validateJwtUser(userId); //this returned userId object will be attached to the request object so that you can access it in the protected routes by using like   async login(@Request() req) {return req.user.id;}
    return user;
  }
}
