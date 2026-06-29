import { Controller, Get, Query, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyGuard } from '../auth/guards/company.guard';
import { CompanyOptional, CurrentCompany } from '../common/decorators/company.decorator';
import { GrowthOverviewService } from './growth-overview.service';
import { GetGrowthOverviewDto } from './dto/get-growth-overview.dto';

@ApiTags('Growth Overview')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('growth-overview')
export class GrowthOverviewController {
  constructor(private readonly growthOverviewService: GrowthOverviewService) {}

  // || ---------------------- Get Growth Overview API ---------------------|| //
  @Get()
  @CompanyOptional()
  @ApiOperation({ summary: 'Get Growth Overview Analytics' })
  getGrowthOverview(@CurrentCompany() company: any, @Query() queryDto: GetGrowthOverviewDto) {
    return this.growthOverviewService.getGrowthOverview(company, queryDto);
  }

  // || ---------------------- Export Growth Overview CSV API ---------------------|| //
  @Get('export')
  @CompanyOptional()
  @ApiOperation({ summary: 'Export growth overview data as CSV' })
  async exportGrowthOverview(
    @CurrentCompany() company: any,
    @Query() queryDto: GetGrowthOverviewDto,
    @Res() res: Response,
  ) {
    const csvData = await this.growthOverviewService.exportGrowthOverviewCsv(company, queryDto);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=growth_export_${timestamp}.csv`);
    
    return res.status(200).send(csvData);
  }
}

