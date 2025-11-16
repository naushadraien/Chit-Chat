import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIP } from 'class-validator';

export class DeviceInfoDto {
  @ApiProperty({
    description: 'Id of the device',
    example: 'dfghd35',
    type: String,
  })
  @IsString()
  deviceId: string;

  @ApiPropertyOptional({
    description: 'Name of the device',
    example: 'samsung',
    type: String,
  })
  @IsString()
  @IsOptional()
  deviceName?: string;

  @ApiPropertyOptional({
    description: 'Type of the device',
    example: 'android',
    type: String,
  })
  @IsString()
  @IsOptional()
  deviceType?: string;

  @ApiPropertyOptional({
    description: 'Name of the device operating system',
    example: 'android',
    type: String,
  })
  @IsString()
  @IsOptional()
  osName?: string;

  @ApiPropertyOptional({
    description: 'Version of the device operating system',
    example: '1.0',
    type: String,
  })
  @IsString()
  @IsOptional()
  osVersion?: string;

  @ApiPropertyOptional({
    description: 'Version of the app',
    example: '1.0',
    type: String,
  })
  @IsString()
  @IsOptional()
  appVersion?: string;

  @ApiPropertyOptional({
    description: 'Name of the browser',
    example: 'chrome',
    type: String,
  })
  @IsString()
  @IsOptional()
  browser?: string;

  // @IsIP()
  // @IsOptional()
  // ipAddress?: string;

  // @IsString()
  // @IsOptional()
  // userAgent?: string;
}
