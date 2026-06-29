import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { generateOtp, hashPassword } from "../utils/crypto.util";
import { MailerService } from "@nestjs-modules/mailer";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ResetPasswordDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private mailerService: MailerService,
  ) {}

  async generatetoken(data: any) {
    const payload = {
      _id: data._id,
      sub: data._id,
      email: data.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // || ---------------------- Forgot password function ---------------------|| //
  async forgotPassword(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return ResponseHelper.error("User not found", 404);
      }
      let otp = generateOtp();
      
      user.resetOtp = otp;
      user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await this.mailerService.sendMail({
        to: email,
        subject: "Your OTP for Password Reset",
        text: `Your OTP for password reset is: ${otp}`,
      });
      return ResponseHelper.success("OTP sent successfully", { otp: otp });
    } catch (error) {
      return ResponseHelper.error("Error sending OTP", 500);
    }
  }

  // || ---------------------- Check OTP function ---------------------|| //
  async checkOtp(otp: number, email: string) {
    try {
      let user = await this.userModel.findOne({ email });
      if (!user) {
        return ResponseHelper.error("User not found", 404);
      }
      if (!user.resetOtp || !user.resetOtpExpires) {
        return ResponseHelper.error("OTP not found or not generated", 400);
      }

      if (new Date() > user.resetOtpExpires) {
        user.resetOtp = null as any;
        user.resetOtpExpires = null as any;
        await user.save();
        return ResponseHelper.error("OTP expired", 400);
      }

      if (user.resetOtp !== otp) {
        return ResponseHelper.error("Invalid OTP", 400);
      }

      user.resetOtp = null as any;
      user.resetOtpExpires = null as any;
      await user.save();
      
      // Generate a temporary reset token valid for 15 minutes
      const resetToken = await this.jwtService.signAsync(
        { sub: user._id, type: 'reset-password' },
        { expiresIn: '15m' }
      );

      return ResponseHelper.success("OTP verified successfully", {
        resetToken,
      });
    } catch (error) {
      return ResponseHelper.error("Error verifying OTP", 500);
    }
  }

  // || ---------------------- Reset password function ---------------------|| //
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      // Verify token
      let payload;
      try {
        payload = await this.jwtService.verifyAsync(resetPasswordDto.token);
      } catch (err) {
        return ResponseHelper.error("Invalid or expired reset token", 401);
      }

      if (payload.type !== 'reset-password') {
        return ResponseHelper.error("Invalid token type", 401);
      }

      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        return ResponseHelper.error("User not found", 404);
      }

      const hashedPassword = await hashPassword(resetPasswordDto.password);
      user.password = hashedPassword;
      await user.save();
      
      return ResponseHelper.success("Password reset successfully", {});
    } catch (error) {
      return ResponseHelper.error(
        "Error resetting password",
        500,
      );
    }
  }
}
