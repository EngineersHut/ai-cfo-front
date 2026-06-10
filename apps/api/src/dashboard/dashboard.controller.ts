import { Controller, Get, Query, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyGuard } from '../auth/guards/company.guard';
import { CurrentCompany } from '../common/decorators/company.decorator';
import { DashboardService } from './dashboard.service';
import { GetDashboardDto } from './dto/get-dashboard.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@ApiHeader({ name: 'x-company-id', required: true, description: 'Company ID' })
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
  // || ---------------------- Export Cost Efficiency CSV API ---------------------|| //
  @Get('export-cost-efficiency')
  @ApiOperation({ summary: 'Export Cost Efficiency data as CSV' })
  async exportCostEfficiency(
    @CurrentCompany() company: any,
    @Query() queryDto: GetDashboardDto,
    @Res() res: Response,
  ) {
    const csvData = await this.dashboardService.exportCostEfficiencyCsv(company, queryDto);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=cost_efficiency_${timestamp}.csv`);
    
    return res.status(200).send(csvData);
  }
}
