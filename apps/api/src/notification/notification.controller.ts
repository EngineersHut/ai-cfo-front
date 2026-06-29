import { Controller, Get, Post, Delete, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  async getNotifications(@Req() req: any) {
    const userId = req.user._id || req.user.id;
    return this.notificationService.getNotifications(userId);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for the current user' })
  async markAllAsRead(@Req() req: any) {
    const userId = req.user._id || req.user.id;
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all notifications for the current user' })
  async clearAll(@Req() req: any) {
    const userId = req.user._id || req.user.id;
    return this.notificationService.clearAll(userId);
  }
}
