import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import type { Request, Response } from 'express';

import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { GoogleOauthGuard } from '../auth/guards/google-oauth.guard';
import { FacebookOauthGuard } from '../auth/guards/facebook-oauth.guard';
import { AppleOauthGuard } from '../auth/guards/apple-oauth.guard';

import { oauthRedirect } from '../common/helpers/oauth-redirect.helper';
import { CheckOtpDto } from './dto/checkOtpDto.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  // LOCAL SIGNUP
  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  // LOCAL LOGIN
  @Post('signin')
  @ApiOperation({
    summary: 'Login user',
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
  ) {
    return this.userService.login(loginUserDto);
  }

  // GOOGLE LOGIN
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({
    summary:
      'Initiate Google login redirect',
  })
  async googleAuth() {}

  // GOOGLE CALLBACK
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({
    summary:
      'Google login redirect callback',
  })
  async googleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result =
      await this.userService.validateOAuthUser(
        req.user,
      );

    return oauthRedirect(res, result);
  }

  // FACEBOOK LOGIN
  @Get('facebook')
  @UseGuards(FacebookOauthGuard)
  @ApiOperation({
    summary:
      'Initiate Facebook login redirect',
  })
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(FacebookOauthGuard)
  @ApiOperation({
    summary:
      'Facebook login redirect callback',
  })
  async facebookAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result =
      await this.userService.validateOAuthUser(
        req.user,
      );

    return oauthRedirect(res, result);
  }

  // APPLE LOGIN
  @Get('apple')
  @UseGuards(AppleOauthGuard)
  @ApiOperation({
    summary:
      'Initiate Apple login redirect',
  })
  async appleAuth() {}

  // APPLE CALLBACK
  @Post('apple/callback')
  @UseGuards(AppleOauthGuard)
  @ApiOperation({
    summary:
      'Apple login redirect callback',
  })
  async appleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result =
      await this.userService.validateOAuthUser(
        req.user,
      );

    return oauthRedirect(res, result);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary:
      'Initiate forgot password flow',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto.email);
  }
  @Post('check-otp')
  @ApiOperation({
    summary:
      'Check OTP for forgot password flow',
  })
  async checkOtp(@Body() checkOtpDto:CheckOtpDto) {
    return this.userService.checkOtp(checkOtpDto.otp, checkOtpDto.email);
  }
@Post('reset-password')
@ApiOperation({
  summary:
    'Reset password for forgot password flow',
})
async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  return this.userService.resetPassword(resetPasswordDto);
}

}

