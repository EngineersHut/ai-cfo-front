import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";

import { ApiConsumes, ApiOperation, ApiTags, ApiBody } from "@nestjs/swagger";

import type { Request, Response } from "express";

import { UserService } from "./user.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

import { GoogleOauthGuard } from "../auth/guards/google-oauth.guard";
import { FacebookOauthGuard } from "../auth/guards/facebook-oauth.guard";
import { AppleOauthGuard } from "../auth/guards/apple-oauth.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { oauthRedirect } from "../common/helpers/oauth-redirect.helper";
import { ProfilePicInterceptor } from "../common/helpers/multer-config";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // || ---------------------- Signup API ---------------------|| //
  @Post("signup")
  @ApiOperation({
    summary: "Register a new user",
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // || ---------------------- Signin API ---------------------|| //
  @Post("signin")
  @ApiOperation({
    summary: "Login user",
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  // || ---------------------- Google Auth Initiation ---------------------|| //
  @Get("google")
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({
    summary: "Initiate Google login redirect",
  })
  async googleAuth() {}

  // || ---------------------- Google Auth Callback ---------------------|| //
  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({
    summary: "Google login redirect callback",
  })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.validateOAuthUser(req.user);
    return oauthRedirect(res, result);
  }

  // || ---------------------- Facebook Auth Initiation ---------------------|| //
  @Get("facebook")
  @UseGuards(FacebookOauthGuard)
  @ApiOperation({
    summary: "Initiate Facebook login redirect",
  })
  async facebookAuth() {}

  // || ---------------------- Facebook Auth Callback ---------------------|| //
  @Get("facebook/callback")
  @UseGuards(FacebookOauthGuard)
  @ApiOperation({
    summary: "Facebook login redirect callback",
  })
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.validateOAuthUser(req.user);
    return oauthRedirect(res, result);
  }

  // || ---------------------- Apple Auth Initiation ---------------------|| //
  @Get("apple")
  @UseGuards(AppleOauthGuard)
  @ApiOperation({
    summary: "Initiate Apple login redirect",
  })
  async appleAuth() {}

  // || ---------------------- Apple Auth Callback ---------------------|| //
  @Post("apple/callback")
  @UseGuards(AppleOauthGuard)
  @ApiOperation({
    summary: "Apple login redirect callback",
  })
  async appleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.validateOAuthUser(req.user);
    return oauthRedirect(res, result);
  }

  // || ---------------------- Update Profile API ---------------------|| //
  @Patch("update-profile")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ProfilePicInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Update user profile",
  })
  @ApiBody({
    type: UpdateProfileDto,
  })
  async updateProfile(
    @Req() req: any,
    @Body() body: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user._id || req.user.sub;
    return this.userService.updateProfile(userId, body, file);
  }

  // || ---------------------- Update Password API ---------------------|| //
  @Patch("update-password")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Change user password",
  })
  async updatePassword(
    @Req() req: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user._id || req.user.sub;
    return this.userService.updatePassword(userId, updatePasswordDto);
  }

  // || ---------------------- Get Profile API ---------------------|| //
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get user profile",
  })
  async getProfile(@Req() req: any) {
    const userId = req.user._id || req.user.sub;
    return this.userService.getProfile(userId);
  }
}
