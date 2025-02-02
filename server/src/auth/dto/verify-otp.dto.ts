import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  otp: string;
}
