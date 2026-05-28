import {
  IsEmail,
  IsString
} from 'class-validator';

import { Transform } from 'class-transformer';

export class LoginUserDto {
 
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email!: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password!: string;
}