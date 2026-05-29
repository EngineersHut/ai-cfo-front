import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({  example: 'user@example.com',description: 'User email for password reset' })
  @IsEmail()
  @IsNotEmpty()
    @Transform(({ value }) => value.trim().toLowerCase())
  email!: string;
}
