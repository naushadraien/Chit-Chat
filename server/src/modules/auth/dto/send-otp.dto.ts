import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'Phone number to which code to be send',
    example: '+977 9814864833',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
