import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';

import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { ResponseHelper } from '../common/helpers/response.helper';
import { OtpService } from '../common/services/otp.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private authService: AuthService,
    private otpService: OtpService,
    private mailerService: MailerService,
  private jwtService: JwtService) { }

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      return ResponseHelper.error('password and confirmpassword is not match', 400)
    }
    let checkemail = await this.userModel.findOne({ email: createUserDto.email });

    if (checkemail?.email == createUserDto.email) {
      return ResponseHelper.error(
        'Email already exists',
        400,
      )
    }

    const hashedPassword = await this.otpService.hashPassword(createUserDto.password);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokenObj = await this.authService.generatetoken({ _id: user._id, email: user.email });
    if (!tokenObj) {
      return ResponseHelper.error('Error generating token', 500);
    }

    return ResponseHelper.success('user created', {
      id: user._id,
      name: user.fullName,
      email: user.email,
      token: tokenObj.access_token,
    });
  }
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      return ResponseHelper.error(
        'User not found',
        404,
      )
    }
    const isPasswordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      return ResponseHelper.error(
        'Invalid password',
        401,
      )
    }

    const tokenObj = await this.authService.generatetoken({ _id: user._id, email: user.email });
    if (!tokenObj) {
      return ResponseHelper.error(
        'Error generating token',
        500,
      )
    }
    return ResponseHelper.success(
      'Login successful',
      {
        id: user._id,
        name: user.fullName,
        email: user.email,
        token: tokenObj.access_token,
      },
    );
  }

  async validateOAuthUser(profile: any) {
    const { email, name, provider, providerId } = profile;

    if (!email) {
      return ResponseHelper.error('Email is required from OAuth provider', 400);
    }

    let user = await this.userModel.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await this.userModel.create({
        fullName: name || 'Social User',
        email,
        password: hashedPassword,
        provider,
        providerId
      });
    }
    if (user.provider === 'local') {
      return ResponseHelper.error('User already exists', 400);
    }

    const tokenObj = await this.authService.generatetoken({ _id: user._id, email: user.email });
    if (!tokenObj) {
      return ResponseHelper.error('Error generating token', 500);
    }

    return ResponseHelper.success('Login successful', {
      id: user._id,
      name: user.fullName,
      email: user.email,
      token: tokenObj.access_token,
    });
  }
  async forgotPassword(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return ResponseHelper.error('User not found', 404);
      }
      let otp = this.otpService.generateOtp();
      await this.otpService.setOtp(email, otp);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for password reset is: ${otp}`,
      });
      return ResponseHelper.success('OTP sent successfully', {email:user.email});
    } catch (error) {
      return ResponseHelper.error('Error sending OTP', 500);
    }

  }
  async checkOtp(otp: number, email: string) {
    try {
      let user = await this.userModel.findOne({ email });
      if (!user) { return ResponseHelper.error('User not found', 404); }
      const storedOtp = await this.otpService.getOtp(email);
      if (!storedOtp) {
        return ResponseHelper.error('OTP expired or not found', 400);
      }
      const isMatch = await this.otpService.compareOtp(storedOtp, otp);
      if (!isMatch) {
        return ResponseHelper.error('Invalid OTP', 400);
      }
      await this.otpService.deleteOtp(email);
      const tokenObj = await this.authService.generatetoken({ _id: user._id, email: user.email });
      if (!tokenObj) {
        return ResponseHelper.error('Error generating token', 500);
      }


      return ResponseHelper.success('OTP verified successfully', { token: tokenObj.access_token });
    } catch (error) {
      return ResponseHelper.error('Error in verifying OTP', 500);
    }
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
  if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
    return ResponseHelper.error('password and confirmpassword is not match', 400)
  }
  let tokenvalidate = await this.jwtService.verifyAsync(resetPasswordDto.token);
  if (!tokenvalidate) {
    return ResponseHelper.error('Invalid or expired token', 400);
  }
      const user = await this.userModel.findOne({ _id: tokenvalidate.sub, email: tokenvalidate.email });
      if (!user) {
        return ResponseHelper.error('User not found', 404);
      }
      const hashedPassword = await this.otpService.hashPassword(resetPasswordDto.password);
      user.password = hashedPassword;
      await user.save();
      return ResponseHelper.success('Password reset successfully', {});
    } catch (error: any) {
      return ResponseHelper.error(error.message, 500);
    }
  }
}