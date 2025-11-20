import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import refreshConfig from 'src/config/refresh.config';
import { DeviceInfo } from 'src/database/schemas/session.schema';
import { EmailService } from 'src/modules/email/email.service';
import { SessionService } from 'src/modules/session/session.service';
import { UserData } from 'src/common/types/userData';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserService } from 'src/modules/user/user.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthJWTPayload } from './types/auth.jwtPayload';
import { GenerateOTP } from 'src/common/utils/generate-otp.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService,

    @Inject(refreshConfig.KEY) // Inject the refresh token configuration using the ConfigService
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}
  async registerUser(createUserDto: CreateUserDto) {
    const existedUser = await this.userService.findByEmail(createUserDto.email);
    if (existedUser) throw new ConflictException('User already exists');
    return await this.userService.create(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<UserData> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid Credentials!');
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Credentials!');

    return user.toObject() as UserData;
  }

  async login(userData: UserData & { deviceInfo: DeviceInfo }) {
    const { deviceInfo, ...user } = userData;

    // Generate tokens with device info
    const tokens = await this.generateTokens(user.id, deviceInfo);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      ...tokens,
    };
  }

  async generateTokens(userId: string, deviceInfo: DeviceInfo) {
    const payload: AuthJWTPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    const expiresAt = new Date();
    const expiresInMs = this.parseExpiresIn(
      this.refreshTokenConfig.expiresIn as string,
    );
    expiresAt.setTime(expiresAt.getTime() + expiresInMs);

    // Create session
    const session = await this.sessionService.createSession(
      userId,
      refreshToken,
      deviceInfo,
      expiresAt,
    );

    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
    };
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
    deviceId: string,
  ) {
    // Validate session
    const session = await this.sessionService.validateRefreshToken(
      refreshToken,
      deviceId,
    );

    if (!session || session.userId.toString() !== userId) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      sessionId: session.id,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return { id: user.id, email: user.email };
  }

  async refresh(
    userId: string,
    name: string,
    deviceId: string,
    sessionId: string,
  ) {
    // Get existing session to preserve device info
    const existingSession = await this.sessionService.getSessionById(sessionId);

    if (!existingSession) {
      throw new UnauthorizedException('Session not found');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(
      userId,
      existingSession.deviceInfo,
    );

    return {
      id: userId,
      name,
      ...tokens,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }

  async logOut(userId: string, sessionId?: string) {
    if (sessionId) {
      // Logout specific session
      await this.sessionService.revokeSession(sessionId);
    } else {
      // Logout all sessions
      await this.sessionService.revokeAllSessions(userId);
    }

    return { message: 'Logged out successfully' };
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
      verificationStatus: {
        isPhoneVerified: true,
      },
      otp: null,
      otpExpiresAt: null,
    });

    return {
      success: true,
      message: 'Phone number verified successfully',
      data: updatedUser,
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
  }
}
