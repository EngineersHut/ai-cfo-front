import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';

import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { ResponseHelper } from '../common/helpers/response.helper';



@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private authService: AuthService) { }

  async create(createUserDto: CreateUserDto) {
    let checkemail = await this.userModel.findOne({ email: createUserDto.email });

    if (checkemail?.email == createUserDto.email) {
      return ResponseHelper.error(
        'Email already exists',
        400,
      )
    }
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );


    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return ResponseHelper.success(
      'User created successfully',
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    )
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
        name: user.name,
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
        name: name || 'Social User',
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
      name: user.name,
      email: user.email,
      token: tokenObj.access_token,
    });
  }
}