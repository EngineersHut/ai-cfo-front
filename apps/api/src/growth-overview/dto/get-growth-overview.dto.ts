import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum GrowthPeriodEnum {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export class GetGrowthOverviewDto {


  @ApiProperty({ enum: GrowthPeriodEnum })
  @IsNotEmpty()
  @IsEnum(GrowthPeriodEnum)
  period!: GrowthPeriodEnum;
}
