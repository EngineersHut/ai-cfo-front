import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class CheckOtpDto {
  @ApiProperty({ example: 1234 })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  otp!: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
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
}
