import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetPlanningController } from './budget-planning.controller';
import { BudgetPlanningService } from './budget-planning.service';
import { BudgetPlanning, BudgetPlanningSchema } from '../schemas/budget-planning.schema';
import { DashboardSummary, DashboardSummarySchema } from '../schemas/dashboard-summary.schema';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BudgetPlanning.name, schema: BudgetPlanningSchema },
      { name: DashboardSummary.name, schema: DashboardSummarySchema }
    ]),
    CompanyModule,
  ],
  controllers: [BudgetPlanningController],
  providers: [BudgetPlanningService],
  exports: [BudgetPlanningService]
})
export class BudgetPlanningModule {}
