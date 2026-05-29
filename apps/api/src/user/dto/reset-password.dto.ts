import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { nodeKeyToRedisOptions } from "ioredis/built/cluster/util";

export class ResetPasswordDto {
  @ApiProperty({example:"",description:"token sent for password reset" })
  @IsString()
  @IsNotEmpty()

token!: string;
 @ApiProperty({example:"",description:"User's new password" })

  @ApiProperty({ description: "User's new password" })
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

  @ApiProperty({ description: "User's new password" })
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
}