import { Transform } from "class-transformer";
import { IsEmail, IsNumber } from "class-validator";

export class CheckOtpDto {
    @IsNumber()
    @Transform(({ value }) => Number(value))
    otp!: number;
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsEmail()

    email!: string;
}