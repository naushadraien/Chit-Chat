import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthJWTPayload } from 'src/modules/auth/types/auth.jwtPayload';

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
      jwtFromRequest: (request: WsRequest) => {
        // 1. Try header
        const headerToken = request?.handshake?.headers?.authorization;
        if (headerToken) {
          return headerToken.split(' ')[1];
        }

        // 2. Try auth field (recommended for React Native)
        const authToken = request?.handshake?.auth?.token;
        if (authToken) return authToken;

        // 3. Try query param
        const queryToken = request?.handshake?.query?.token;
        if (queryToken) return queryToken;

        throw new Error('No token found');
      },
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret as string,
    });
  }

  async validate(payload: AuthJWTPayload) {
    const userId = payload.sub;
    const user = await this.authService.validateJwtUser(userId); //this returned user object will be attached to the request object so that you can access it in the protected routes by using like   async login(@Request() req) {return req.user.id;}
    return user; // attaches to req.user
  }
}
