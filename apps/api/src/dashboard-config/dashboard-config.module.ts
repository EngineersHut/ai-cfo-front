import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardConfigController } from './dashboard-config.controller';
import { DashboardConfigService } from './dashboard-config.service';
import { DashboardConfig, DashboardConfigSchema } from './schemas/dashboard-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DashboardConfig.name, schema: DashboardConfigSchema }]),
  ],
  controllers: [DashboardConfigController],
  providers: [DashboardConfigService],
  exports: [DashboardConfigService],
})
export class DashboardConfigModule {}
