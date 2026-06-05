import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyGuard } from '../auth/guards/company.guard';
import { CurrentCompany } from '../common/decorators/company.decorator';
import { DashboardService } from './dashboard.service';
import { GetDashboardDto } from './dto/get-dashboard.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // || ---------------------- Get Dashboard API ---------------------|| //
  @Get()
  @ApiOperation({ summary: 'Get CFO Dashboard Analytics' })
  getDashboard(@CurrentCompany() company: any, @Query() queryDto: GetDashboardDto) {
    return this.dashboardService.getDashboard(company, queryDto);
  }
}
