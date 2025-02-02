import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import googleOauthConfig from 'src/config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleOAuthConfiguration: ConfigType<
      typeof googleOauthConfig
    >,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleOAuthConfiguration.clientID,
      clientSecret: googleOAuthConfiguration.clientSecret,
      callbackURL: googleOAuthConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, displayName } = profile;
    const user = await this.authService.validateGoogleUser({
      name: displayName,
      email: emails[0].value,
      password: '',
    });
    // const { name, emails, photos } = profile;
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   picture: photos[0].value,
    //   accessToken,
    //   refreshToken,
    // };
    done(null, user); //appended to the request like request.user
  }
}
