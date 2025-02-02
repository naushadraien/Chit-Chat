import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/config/jwt.config';
import { AuthService } from '../auth.service';
import { AuthJWTPayload } from '../types/auth.jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // Inject the JWT configuration using the ConfigService
    // The @Inject decorator is used to inject the configuration values defined in jwt.config.ts
    // The jwtConfig.KEY is used to specify the namespace of the configuration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      // Extract the JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ignore expiration is set to false to ensure the token expiration is checked
      ignoreExpiration: false,
      // Use the secret key from the injected configuration for verifying the JWT
      secretOrKey: jwtConfiguration.secret, //passport-jwt will decrypt the access token coming from the request header using this secret key and will give you the payload object
    });
  }

  async validate(payload: AuthJWTPayload) {
    const userId = payload.sub;
    const user = await this.authService.validateJwtUser(userId); //this returned userId object will be attached to the request object so that you can access it in the protected routes by using like   async login(@Request() req) {return req.user.id;}
    return user;
  }
}
