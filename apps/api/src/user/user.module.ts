import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { OtpService } from '../common/services/otp.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    AuthModule,
  ],

  controllers: [UserController],

  providers: [UserService, OtpService],
})
export class UserModule {}
