import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report, ReportSchema } from '../schemas/report.schema';

import { DashboardSummary, DashboardSummarySchema } from '../schemas/dashboard-summary.schema';
import { FleetAnalytics, FleetAnalyticsSchema } from '../schemas/fleet-analytics.schema';
import { GrowthAnalytics, GrowthAnalyticsSchema } from '../schemas/growth-analytics.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { Company, CompanySchema } from '../schemas/company.schema';
import { CompanyModule } from '../company/company.module';
import { ReportSyncService } from './report-sync.service';
import { ReportMapperService } from './mappers/report.mapper';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    CompanyModule,
    AiModule,
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: DashboardSummary.name, schema: DashboardSummarySchema },
      { name: FleetAnalytics.name, schema: FleetAnalyticsSchema },
      { name: GrowthAnalytics.name, schema: GrowthAnalyticsSchema },
      { name: Transaction.name, schema: TransactionSchema }
    ])
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportSyncService, ReportMapperService],
  exports: [ReportService],
})
export class ReportModule {}
