import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import refreshConfig from 'src/config/refresh.config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJWTPayload } from './types/auth.jwtPayload';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GenerateOTP } from 'src/utils/generate-otp.utils';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,

    @Inject(refreshConfig.KEY) // Inject the refresh token configuration using the ConfigService
    private refreshTokenConfiguration: ConfigType<typeof refreshConfig>,
  ) {}
  async registerUser(createUserDto: CreateUserDto) {
    const existedUser = await this.userService.findByEmail(createUserDto.email);
    if (existedUser) throw new ConflictException('User already exists');
    const createdUser = await this.userService.create(createUserDto);
    const { accessToken, refreshToken } = await this.generateTokens(
      createdUser._id.toString(),
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateHashedRefreshToken(
      createdUser._id.toString(),
      hashedRefreshToken,
    );

    return {
      ...createdUser,
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid Credentials!');
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Credentials!');

    return { id: user.id, name: user.name };
  }

  async login(userId: string, name?: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      name,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: string) {
    const payload: AuthJWTPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfiguration),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return { id: user.id, email: user.email };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found!');
    const isRefreshTokenMatched = await bcrypt.compare(
      //this is for invalidating or revoking the refresh token when the user logs out
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!isRefreshTokenMatched)
      throw new UnauthorizedException('Invalid refresh token');
    return { id: user.id, name: user.name };
  }

  async refresh(userId: string, name: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10); //this is done for invalidating or revoking the refresh token when the user logs out to prevent the user from using the old refresh token to get a new access token
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      name,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }

  async logOut(userId: string) {
    return await this.userService.updateHashedRefreshToken(userId, null); //this is done for invalidating or revoking the refresh token when the user logs out to prevent the user from using the old refresh token to get a new access token
  }

  async sendOtp(
    data: SendOtpDto,
    req: { user: { id: string; email: string } },
  ) {
    if (!data.phoneNumber) {
      throw new BadRequestException('Phone number is required');
    }

    const otp = GenerateOTP.generateOtp(6);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP with user
    await this.userService.updateUserOtp(req.user.id, {
      phoneNumber: data.phoneNumber,
      otp,
      otpExpiresAt,
      isPhoneVerified: false,
    });

    await this.emailService.sendVerificationCode(req.user.email, otp);

    // TODO: Send OTP via SMS
    console.log('DEV MODE - OTP:', otp);

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresAt: otpExpiresAt,
      data: {
        otp,
        phoneNumber: data.phoneNumber,
      },
    };
  }

  async verifyOtp(data: VerifyOtpDto, req: { user: { id: string } }) {
    const user = await this.userService.findUserById(req.user.id);

    if (!user.otp || !user.otpExpiresAt) {
      throw new BadRequestException('No OTP request found');
    }

    if (user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    if (user.otp !== data.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Mark phone as verified
    const updatedUser = await this.userService.updateUserOtp(req.user.id, {
      isPhoneVerified: true,
      otp: null,
      otpExpiresAt: null,
    });

    return {
      success: true,
      message: 'Phone number verified successfully',
      data: updatedUser,
    };
  }
}
