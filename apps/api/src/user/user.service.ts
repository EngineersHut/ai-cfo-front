import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

import * as bcrypt from "bcryptjs";

import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { AuthService } from "../auth/auth.service";
import { ResponseHelper } from "../common/helpers/response.helper";
import { hashPassword } from "../utils/crypto.util";
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  // || ---------------------- Create for signup function ---------------------|| //
  async create(createUserDto: CreateUserDto) {
    let checkemail = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (checkemail?.email == createUserDto.email) {
      return ResponseHelper.error("Email already exists", 400);
    }
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return ResponseHelper.success("User created successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  }

  // || ---------------------- Login user function ---------------------|| //
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      return ResponseHelper.error("User not found", 404);
    }
    const isPasswordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      return ResponseHelper.error("Invalid password", 401);
    }

    const tokenObj = await this.authService.generatetoken({
      _id: user._id,
      email: user.email,
    });
    if (!tokenObj) {
      return ResponseHelper.error("Error generating token", 500);
    }
    return ResponseHelper.success("Login successful", {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: tokenObj.access_token,
    });
  }

  // || ---------------------- Validate OAuth user function ---------------------|| //
  async validateOAuthUser(profile: any) {
    const { email, name, provider, providerId } = profile;

    if (!email) {
      return ResponseHelper.error("Email is required from OAuth provider", 400);
    }

    let user = await this.userModel.findOne({ email });

    if (!user) {
      const randomPassword =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await this.userModel.create({
        name: name || "Social User",
        email,
        password: hashedPassword,
        provider,
        providerId,
      });
    }
    if (user.provider === "local") {
      return ResponseHelper.error("User already exists", 400);
    }

    const tokenObj = await this.authService.generatetoken({
      _id: user._id,
      email: user.email,
    });
    if (!tokenObj) {
      return ResponseHelper.error("Error generating token", 500);
    }

    return ResponseHelper.success("Login successful", {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: tokenObj.access_token,
    });
  }

  // || ---------------------- Update Profile function ---------------------|| //
  async updateProfile(
    userId: string,
    updateData: { name?: string; email?: string },
    file?: Express.Multer.File,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return ResponseHelper.error("User not found", 404);
    }

    if (updateData.email) {
      const checkEmail = await this.userModel.findOne({ 
        email: updateData.email, 
        _id: { $ne: userId } 
      });
      if (checkEmail) {
        return ResponseHelper.error("Email already in use", 400);
      }
      user.email = updateData.email;
    }

    if (updateData.name) {
      user.name = updateData.name;
    }

    if (file) {
      // Replace backslashes with forward slashes to ensure valid URL paths
      user.profilePic = file.path.replace(/\\/g, "/");
    }

    await user.save();

    return ResponseHelper.success("Profile updated successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  }

  // || ---------------------- Update Password function ---------------------|| //
  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return ResponseHelper.error("User not found", 404);
    }

    const isPasswordMatch = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      return ResponseHelper.error("Incorrect current password", 400);
    }

    const hashedPassword = await hashPassword(updatePasswordDto.newPassword);
    user.password = hashedPassword;
    await user.save();

    return ResponseHelper.success("Password changed successfully", null);
  }

  // || ---------------------- Get Profile function ---------------------|| //
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select("-password");
    if (!user) {
      return ResponseHelper.error("User not found", 404);
    }

    return ResponseHelper.success("Profile fetched successfully", user);
  }
}
