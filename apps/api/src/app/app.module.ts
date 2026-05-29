import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { DashboardConfigModule } from '../dashboard-config/dashboard-config.module';

let url = process.env.MONGODBURL || 'mongodb://127.0.0.1:27017/cfo';

@Module({
  imports: [
    MongooseModule.forRoot(url),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM || '"AI CFO" <no-reply@aicfo.com>',
      },
    }),
    UserModule,
    AuthModule,
    DashboardConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
