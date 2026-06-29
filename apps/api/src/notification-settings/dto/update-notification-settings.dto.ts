import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationSettingsDto {
  @ApiPropertyOptional({
    description: 'Toggle email notifications for system updates and features',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Toggle real-time push notification alerts for budget or liquidity issues',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  alertsForFinancialRisks?: boolean;

  @ApiPropertyOptional({
    description: 'Toggle automated executive summaries delivered every Monday',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  weeklySummaryReports?: boolean;
}
