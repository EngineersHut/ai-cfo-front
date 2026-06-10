import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiHeader,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CompanyGuard } from "../auth/guards/company.guard";
import { CurrentCompany } from "../common/decorators/company.decorator";
import { BudgetPlanningService } from "./budget-planning.service";
import { GetBudgetDto } from "./dto/get-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";

@ApiTags("Budget Planning")
@ApiBearerAuth()
@ApiHeader({
  name: "company-id",
  description: "Company ID (required for CompanyGuard)",
  required: true,
})
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller("budget-planning")
export class BudgetPlanningController {
  constructor(private readonly budgetPlanningService: BudgetPlanningService) {}

  // || ---------------------- Get Budget Overview API ---------------------|| //
  @Get()
  @ApiOperation({ summary: "Get Budget vs Actual Analytics" })
  async getBudgetOverview(
    @CurrentCompany() company: any,
    @Query() queryDto: GetBudgetDto,
  ) {
    // If companyId is not provided in query but exists in token, you could set it:
    if (!queryDto.companyId && company?._id) {
      queryDto.companyId = company._id.toString();
    }
    return this.budgetPlanningService.getBudgetOverview(queryDto);
  }

  // || ---------------------- Upsert Budget Plan API ----------------------|| //
  @Post()
  @ApiOperation({ summary: "Update or Create Budget Plan Line Items" })
  async upsertBudget(
    @CurrentCompany() company: any,
    @Body() updateDto: UpdateBudgetDto,
  ) {
    if (!updateDto.companyId && company?._id) {
      updateDto.companyId = company._id.toString();
    }
    return this.budgetPlanningService.upsertBudget(updateDto);
  }
}
