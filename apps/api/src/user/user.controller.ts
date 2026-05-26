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

import { GoogleOauthGuard } from '../auth/guards/google-oauth.guard';
import { FacebookOauthGuard } from '../auth/guards/facebook-oauth.guard';
import { AppleOauthGuard } from '../auth/guards/apple-oauth.guard';

import { oauthRedirect } from '../common/helpers/oauth-redirect.helper';

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
}