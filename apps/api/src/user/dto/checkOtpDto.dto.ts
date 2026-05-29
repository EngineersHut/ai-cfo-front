import { ApiAcceptedResponse, ApiProcessingResponse, ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class CheckOtpDto {
    @ApiProperty({example:120000,description: "One-time password sent to the user's email" })

    @IsNumber()
    @Transform(({ value }) => Number(value))
    otp!: number;
    @ApiProperty({ example: 'user@example.com', description: "User's email address" })
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsEmail()
    @IsNotEmpty()
     email!: string;
}