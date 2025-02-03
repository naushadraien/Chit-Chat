import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UploadService } from 'src/upload/upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly uploadService: UploadService,
  ) {}

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

  async update(userId: string, updateUserDto: UpdateUserDto) {
    if (!userId) throw new BadRequestException('User id is required');
    return await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          ...updateUserDto,
        },
        { new: true },
      )
      .select('-password -hashedRefreshToken -otp -otpExpiresAt')
      .lean()
      .exec();
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const uploadedFile = await this.uploadService.uploadFile(file);
    return await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          avatar: uploadedFile.url,
        },
        { new: true },
      )
      .select('-password -hashedRefreshToken -otp -otpExpiresAt')
      .lean()
      .exec();
  }
}
