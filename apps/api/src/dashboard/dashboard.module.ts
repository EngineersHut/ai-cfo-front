import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CompanyModule } from '../company/company.module';
import { DashboardSummary, DashboardSummarySchema } from '../schemas/dashboard-summary.schema';
import { FleetAnalytics, FleetAnalyticsSchema } from '../schemas/fleet-analytics.schema';
import { GrowthAnalytics, GrowthAnalyticsSchema } from '../schemas/growth-analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DashboardSummary.name, schema: DashboardSummarySchema },
      { name: FleetAnalytics.name, schema: FleetAnalyticsSchema },
      { name: GrowthAnalytics.name, schema: GrowthAnalyticsSchema },
    ]),
    CompanyModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
