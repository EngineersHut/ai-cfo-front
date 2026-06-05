import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum DashboardPeriodEnum {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export class GetDashboardDto {


  @ApiProperty({ enum: DashboardPeriodEnum })
  @IsNotEmpty()
  @IsEnum(DashboardPeriodEnum)
  period!: DashboardPeriodEnum;
}
