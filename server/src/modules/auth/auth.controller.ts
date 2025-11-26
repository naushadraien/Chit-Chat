import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Ip,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Response } from 'express';
import frontendConfig from 'src/config/frontend.config';
import { UserData } from 'src/common/types/userData';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleOAuthGuard } from './guards/google-oauth/google-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { DeviceInfo } from 'src/database/schemas/session.schema';
import { LogoutDto } from './dto/logout.dto';
import { SessionService } from 'src/modules/session/session.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,

    @Inject(frontendConfig.KEY)
    private readonly frontendConfiguration: ConfigType<typeof frontendConfig>,

    //other way to access the frontendUrl from the env instead of using frontendConfiguration is using of configService as:
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard) // this is the local strategy guard which is used to authenticate the user using email and password
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  login(
    @Request()
    req: {
      user: UserData & { deviceInfo: DeviceInfo }; // Contains both user and deviceInfo from strategy
    },
  ) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(RefreshAuthGuard) // this is the refresh token strategy guard which is used to authenticate the user using refresh token and get a new access token
  @Post('refresh')
  refresh(@Request() req: any) {
    const { user, deviceId } = req.user;
    return this.authService.refresh(
      user.id,
      user.name,
      deviceId,
      user.sessionId,
    );
  }

  @Public()
  @UseGuards(GoogleOAuthGuard) // this is the google oauth strategy guard which is used to authenticate the user using google oauth and get a new access token
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Request()
    req: any,
    @Ip() ipAddress: string,
    @Res() res: Response,
  ) {
    // For Google OAuth, create device info from request
    const deviceInfo = {
      deviceId: 'web-' + Date.now(), // Generate web device ID
      deviceType: 'web',
      browser: req.headers['user-agent']?.split(' ')[0] || 'Unknown',
      ipAddress: ipAddress || req.ip,
      userAgent: req.headers['user-agent'] || '',
    };

    const response = await this.authService.login({
      ...req.user,
      deviceInfo: deviceInfo,
    });
    const params = new URLSearchParams();
    params.append('accessToken', response.accessToken);
    params.append('refreshToken', response.refreshToken);
    params.append('sessionId', response.sessionId);
    params.append('userId', response.id.toString());

    console.log('url of frontend', this.frontendConfiguration.frontendURL);

    // const frontendURL = this.frontendConfiguration.frontendURL;// we can access frontendURL like this or using the below method as
    const frontendURL = this.configService.get<string>('FRONTEND_URL');

    return res.redirect(
      `${frontendURL}/api/auth/google/callback?${params.toString()}`,
    );
  } //callback means redirect to some page when login

  @Get('profile')
  @ApiOperation({
    summary: 'Get logged in user detail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {},
  })
  async loggedInUserprofile(
    @Request()
    req: {
      user: {
        id: string;
      };
    },
  ) {
    const userId = req.user.id;
    return await this.authService.loggedInUserprofile(userId);
  }

  //Removed the @UseGuards(JwtAuthGuard) decorator as all the api routes are protected by the JwtAuthGuard globally
  // @UseGuards(JwtAuthGuard) // only signed in user can call this route
  @Post('logout')
  async logOut(
    @Request()
    req: {
      user: {
        id: string;
      };
    },
    @Body() logoutDto?: LogoutDto,
  ) {
    return this.authService.logOut(req.user.id, logoutDto?.sessionId);
  }

  @Get('sessions')
  async getActiveSessions(@Request() req: { user: { id: string } }) {
    const sessions = await this.sessionService.getActiveSessions(req.user.id);
    return { sessions };
  }

  @Post('logout-others')
  @HttpCode(HttpStatus.OK)
  async logoutOthers(
    @Request() req: { user: { id: string } },
    @Body('currentSessionId') currentSessionId: string,
  ) {
    const count = await this.sessionService.revokeAllSessionsExceptCurrent(
      req.user.id,
      currentSessionId,
    );
    return { message: `Logged out from ${count} other session(s)` };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Request() req: { user: { id: string } }) {
    const count = await this.sessionService.revokeAllSessions(req.user.id);
    return { message: `Logged out from all ${count} session(s)` };
  }

  @Post('send-otp')
  async sendOtp(
    @Body() data: SendOtpDto,
    @Request()
    req: {
      user: {
        id: string;
        email: string;
      };
    },
  ) {
    return await this.authService.sendOtp(data, req);
  }

  @Post('verify-otp')
  @HttpCode(200) //for sending the status code of 200 instead of 201
  async verifyOtp(
    @Body() data: VerifyOtpDto,
    @Request()
    req: {
      user: {
        id: string;
      };
    },
  ) {
    return await this.authService.verifyOtp(data, req);
  }
}
