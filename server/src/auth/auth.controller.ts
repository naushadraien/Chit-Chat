import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Response } from 'express';
import frontendConfig from 'src/config/frontend.config';
import { UserData } from 'src/types/userData';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleOAuthGuard } from './guards/google-oauth/google-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

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
  @HttpCode(200)
  login(
    @Request()
    req: {
      user: UserData;
    },
  ) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(RefreshAuthGuard) // this is the refresh token strategy guard which is used to authenticate the user using refresh token and get a new access token
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refresh(req.user.id, req.user.name);
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
    req: {
      user: UserData;
    },
    @Res() res: Response,
  ) {
    console.log('🚀 ~ AuthController ~ googleCallback ~ req:', req.user);

    const response = await this.authService.login(req.user);
    const params = new URLSearchParams();
    params.append('accessToken', response.accessToken);
    params.append('refreshToken', response.refreshToken);
    params.append('userId', response.id.toString());

    console.log('url of frontend', this.frontendConfiguration.frontendURL);

    // const frontendURL = this.frontendConfiguration.frontendURL;// we can access frontendURL like this or using the below method as
    const frontendURL = this.configService.get<string>('FRONTEND_URL');

    return res.redirect(
      `${frontendURL}/api/auth/google/callback?${params.toString()}`,
    );
  } //callback means redirect to some page when login

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
  ) {
    return this.authService.logOut(req.user.id);
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
