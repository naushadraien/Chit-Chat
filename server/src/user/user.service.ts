import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.userModel.create({
      ...user,
      password: hashedPassword,
    });

    return await this.userModel
      .findById(createdUser._id)
      .select(
        '-password -hashedRefreshToken -otp -otpExpiresAt -isPhoneVerified',
      )
      .lean()
      .exec();
  }

  async findByEmail(email: CreateUserDto['email']) {
    return await this.userModel.findOne({
      email,
    });
  }

  async findUserById(userId: string) {
    return await this.userModel.findById(userId);
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    return await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          hashedRefreshToken,
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async updateUserOtp(
    userId: string,
    data: Partial<{
      phoneNumber: string;
      otp: string;
      otpExpiresAt: Date;
      isPhoneVerified: boolean;
    }>,
  ) {
    const resultWithExec = await this.userModel
      .findByIdAndUpdate(userId, { ...data }, { new: true })
      .select('-password')
      .exec();

    return resultWithExec;
  }
}
