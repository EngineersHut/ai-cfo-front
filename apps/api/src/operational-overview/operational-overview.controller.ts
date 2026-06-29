import { Controller, Get, Query, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyGuard } from '../auth/guards/company.guard';
import { CompanyOptional, CurrentCompany } from '../common/decorators/company.decorator';
import { OperationalOverviewService } from './operational-overview.service';
import { GetOperationalOverviewDto } from './dto/get-operational-overview.dto';

@ApiTags('Operational Overview')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('operational-overview')
export class OperationalOverviewController {
  constructor(private readonly operationalOverviewService: OperationalOverviewService) {}

  // || ---------------------- Get Operational Overview API ---------------------|| //
  @Get()
  @CompanyOptional()
  @ApiOperation({ summary: 'Get Operational Overview Analytics' })
  getOperationalOverview(@CurrentCompany() company: any, @Query() queryDto: GetOperationalOverviewDto) {
    return this.operationalOverviewService.getOperationalOverview(company, queryDto);
  }

  // || ---------------------- Export Operational Overview CSV API ---------------------|| //
  @Get('export')
  @CompanyOptional()
  @ApiOperation({ summary: 'Export operational overview data as CSV' })
  async exportOperationalOverview(
    @CurrentCompany() company: any,
    @Query() queryDto: GetOperationalOverviewDto,
    @Res() res: Response,
  ) {
    const csvData = await this.operationalOverviewService.exportOperationalOverviewCsv(company, queryDto);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=operational_export_${timestamp}.csv`);
    
    return res.status(200).send(csvData);
  }
}

