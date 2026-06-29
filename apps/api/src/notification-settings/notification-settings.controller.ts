import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationSettingsService } from './notification-settings.service';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notification Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notification-settings')
export class NotificationSettingsController {
  constructor(
    private readonly notificationSettingsService: NotificationSettingsService,
  ) {}

  // || ---------------------- Get Notification Settings API ---------------------|| //
  @Get()
  @ApiOperation({
    summary: 'Get or initialize notification settings for the current user',
  })
  findOne(@Request() req: any) {
    const userId = req.user._id || req.user.id;
    return this.notificationSettingsService.findOneOrInitialize(userId);
  }

  // || ---------------------- Update Notification Settings API ---------------------|| //
  @Patch()
  @ApiOperation({
    summary: 'Update notification settings for the current user',
  })
  update(
    @Request() req: any,
    @Body() updateDto: UpdateNotificationSettingsDto,
  ) {
    const userId = req.user._id || req.user.id;
    return this.notificationSettingsService.update(userId, updateDto);
  }
}
