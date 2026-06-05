import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyGuard } from '../auth/guards/company.guard';
import { CurrentCompany } from '../common/decorators/company.decorator';
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
  @ApiOperation({ summary: 'Get Operational Overview Analytics' })
  getOperationalOverview(@CurrentCompany() company: any, @Query() queryDto: GetOperationalOverviewDto) {
    return this.operationalOverviewService.getOperationalOverview(company, queryDto);
  }
}
