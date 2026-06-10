import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum GrowthPeriodEnum {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export class GetGrowthOverviewDto {
  @ApiPropertyOptional({ enum: GrowthPeriodEnum })
  @IsOptional()
  @IsEnum(GrowthPeriodEnum)
  period?: GrowthPeriodEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  month?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;
}
