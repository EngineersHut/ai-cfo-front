import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company, CompanySchema } from '../schemas/company.schema';

import { DashboardSummary, DashboardSummarySchema } from '../schemas/dashboard-summary.schema';
import { GrowthAnalytics, GrowthAnalyticsSchema } from '../schemas/growth-analytics.schema';
import { FleetAnalytics, FleetAnalyticsSchema } from '../schemas/fleet-analytics.schema';
import { BudgetPlanning, BudgetPlanningSchema } from '../schemas/budget-planning.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { DashboardConfig, DashboardConfigSchema } from '../schemas/dashboard-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: DashboardSummary.name, schema: DashboardSummarySchema },
      { name: GrowthAnalytics.name, schema: GrowthAnalyticsSchema },
      { name: FleetAnalytics.name, schema: FleetAnalyticsSchema },
      { name: BudgetPlanning.name, schema: BudgetPlanningSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: DashboardConfig.name, schema: DashboardConfigSchema },
    ])
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
