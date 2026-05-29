import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "The full name of the user",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name!: string;

  @ApiProperty({
    description: "The email address of the user",
    example: "user@example.com",
  })
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email!: string;

  @ApiProperty({
    description: "The password for the user, must be strong",
    example: "StrongPassword123!",
  })
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
