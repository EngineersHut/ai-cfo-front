import { IsString, IsEnum, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndustryEnum, CurrencyEnum } from '../../common/enums/company.enum';

export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of the company', example: 'Nexus FinTech Global' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'The industry the company operates in', enum: IndustryEnum, example: IndustryEnum.TECHNOLOGY_AND_SAAS })
  @IsEnum(IndustryEnum)
  @IsNotEmpty()
  industry!: string;

  @ApiProperty({ description: 'The currency used by the company', enum: CurrencyEnum, example: CurrencyEnum.USD })
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  currency!: string;

  @ApiPropertyOptional({ description: 'Whether this is the primary company for the user', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
