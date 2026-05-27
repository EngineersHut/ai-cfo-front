import { Transform } from "class-transformer";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
@IsString()
    _id!: string;
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email!: string;

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