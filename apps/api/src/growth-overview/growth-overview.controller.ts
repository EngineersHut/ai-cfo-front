import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
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
}
