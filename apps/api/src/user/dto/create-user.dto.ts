import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: "User's full name" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  fullName!: string;
@ApiProperty({ example: 'user@example.com', description: "User's email address" })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email!: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: "User's password" })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Transform(({ value }) => value.trim())
  password!: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: "Confirm User's password" })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Transform(({ value }) => value.trim())
  confirmPassword!: string;
  @ApiProperty({ example: false, description: "User's agreement to terms and conditions" })
  @IsBoolean()
  agreeToTerms!: boolean;

}