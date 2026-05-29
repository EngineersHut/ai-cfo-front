import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { DashboardConfigService } from './dashboard-config.service';
import { UpdateDashboardConfigDto } from './dto/update-dashboard-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard Config')
@Controller('dashboard-config')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardConfigController {
  constructor(private readonly configService: DashboardConfigService) {}

  // || ---------------------- Get Dashboard Config API ---------------------|| //
  @Get()
  @ApiOperation({ summary: 'Get user dashboard configuration' })
  async getConfig(@Req() req: any) {
    const userId = req.user._id || req.user.sub;
    return this.configService.getConfig(userId);
  }

  // || ---------------------- Update Dashboard Config API ---------------------|| //
  @Patch()
  @ApiOperation({ summary: 'Update user dashboard configuration' })
  @ApiBody({ type: UpdateDashboardConfigDto })
  async updateConfig(
    @Req() req: any,
    @Body() updateDto: UpdateDashboardConfigDto
  ) {
    const userId = req.user._id || req.user.sub;
    return this.configService.updateConfig(userId, updateDto);
  }
}
