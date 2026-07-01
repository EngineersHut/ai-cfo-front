import { IsString, IsEnum, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndustryEnum, CurrencyEnum, FinancialYearTypeEnum } from '../../common/enums/company.enum';

export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of the company', example: 'Nexus FinTech Global' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'The industry the company operates in', enum: IndustryEnum, example: IndustryEnum.TECHNOLOGY_AND_IT })
  @IsEnum(IndustryEnum)
  @IsNotEmpty()
  industry!: string;

  @ApiPropertyOptional({ description: 'The sub-industry the company operates in', example: 'Fleet Management' })
  @IsString()
  @IsOptional()
  subIndustry?: string;

  @ApiProperty({ description: 'The currency used by the company', enum: CurrencyEnum, example: CurrencyEnum.USD })
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  currency!: string;

  @ApiPropertyOptional({ description: 'Whether this is the primary company for the user', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'The financial year type of the company', enum: FinancialYearTypeEnum, example: FinancialYearTypeEnum.APR_TO_MAR })
  @IsEnum(FinancialYearTypeEnum)
  @IsOptional()
  financialYearType?: string;
}
