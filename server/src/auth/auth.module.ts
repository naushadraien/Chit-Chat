import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import refreshConfig from 'src/config/refresh.config';
import frontendConfig from 'src/config/frontend.config';
import googleOauthConfig from 'src/config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { WsJwtStrategy } from 'src/auth/strategies/web-socket.strategy';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(frontendConfig),
    EmailModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    RefreshTokenStrategy,
    JwtStrategy,
    WsJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
