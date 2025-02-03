import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateFile } from 'src/common/decorators/file-upload.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':userId')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: string,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @Patch(':userId/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Param('userId') userId: string,
    @UploadedFile(ValidateFile())
    file: Express.Multer.File,
  ) {
    return await this.userService.updateAvatar(userId, file);
  }
}
