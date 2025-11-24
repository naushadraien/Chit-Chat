import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      //this super() method is used to pass the options object to the parent class called PassportStrategy
      usernameField: 'email', // Change this to 'username' if you're using username instead of email
      passwordField: 'password', //the password field is set to 'password' by default but you can change it to any field name you want
      passReqToCallback: true, // Enable request object in validate method
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    if (!password)
      throw new UnauthorizedException('Please provide your password');

    const user = await this.authService.validateUser(email, password);

    // Extract device info from request body
    const deviceInfo = {
      deviceId: req.body.deviceId,
      deviceName: req.body.deviceName,
      deviceType: req.body.deviceType,
      osName: req.body.osName,
      osVersion: req.body.osVersion,
      appVersion: req.body.appVersion,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    // Return both user and device info
    return { deviceInfo, ...user };
  }
}
