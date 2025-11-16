import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Otp to verify the phone number',
    example: '678997',
    maxLength: 6,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  otp: string;
}
