import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperationalOverviewController } from './operational-overview.controller';
import { OperationalOverviewService } from './operational-overview.service';
import { CompanyModule } from '../company/company.module';
import { DashboardSummary, DashboardSummarySchema } from '../schemas/dashboard-summary.schema';
import { FleetAnalytics, FleetAnalyticsSchema } from '../schemas/fleet-analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DashboardSummary.name, schema: DashboardSummarySchema },
      { name: FleetAnalytics.name, schema: FleetAnalyticsSchema },
    ]),
    CompanyModule,
  ],
  controllers: [OperationalOverviewController],
  providers: [OperationalOverviewService],
  exports: [OperationalOverviewService],
})
export class OperationalOverviewModule {}
