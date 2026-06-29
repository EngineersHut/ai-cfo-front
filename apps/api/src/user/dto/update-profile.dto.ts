import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: "User's full name",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "User's email address",
    example: "john@example.com",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Profile picture file",
  })
  @IsOptional()
  profilePic?: any;
}
