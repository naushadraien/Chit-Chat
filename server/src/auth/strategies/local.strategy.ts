import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      //this super() method is used to pass the options object to the parent class called PassportStrategy
      usernameField: 'email', // Change this to 'username' if you're using username instead of email
      passwordField: 'password', //the password field is set to 'password' by default but you can change it to any field name you want
    });
  }

  async validate(email: string, password: string): Promise<any> {
    if (!password)
      throw new UnauthorizedException('Please provide your password');
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; //this returned user object will be attached to the request object so that you can access it in the protected routes by using like   async login(@Request() req) {return req.user;}
  }
}
