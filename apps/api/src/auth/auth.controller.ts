import { Controller, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto, CheckOtpDto, ResetPasswordDto } from "./dto/auth.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // || ---------------------- Forgot Password API ---------------------|| //
  @Post("forgot-password")
  @ApiOperation({
    summary: "Initiate forgot password flow",
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // || ---------------------- Check OTP API ---------------------|| //
  @Post("check-otp")
  @ApiOperation({
    summary: "Check OTP for forgot password flow",
  })
  async checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto.otp, checkOtpDto.email);
  }

  // || ---------------------- Reset Password API ---------------------|| //
  @Post("reset-password")
  @ApiOperation({
    summary: "Reset password for forgot password flow",
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
