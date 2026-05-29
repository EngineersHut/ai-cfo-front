import {
  IsEmail,
  IsString
} from 'class-validator';

import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
 @ApiProperty({example:"user@example.com",description:"User's email address" })
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email!: string;
@ApiProperty({example:"password123",description: "User's password" })
  @IsString()
  @Transform(({ value }) => value.trim())
  password!: string;
}