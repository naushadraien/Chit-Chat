import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token for refreshing the access token',
    example: 'dfgdfkgdfgjbdfgbdfk48fjgbjdf',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({
    description: 'Id of the device',
    example: 'fdhgdf',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
