import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum OperationalPeriodEnum {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export class GetOperationalOverviewDto {


  @ApiProperty({ enum: OperationalPeriodEnum })
  @IsNotEmpty()
  @IsEnum(OperationalPeriodEnum)
  period!: OperationalPeriodEnum;
}
