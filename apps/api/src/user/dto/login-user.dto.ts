import { IsEmail, IsString } from "class-validator";

import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({
    description: "The email address of the user",
    example: "user@example.com",
  })
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email!: string;

  @ApiProperty({
    description: "The password for the user",
    example: "StrongPassword123!",
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  password!: string;
}
