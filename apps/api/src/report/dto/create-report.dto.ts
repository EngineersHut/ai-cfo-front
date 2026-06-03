import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
} from "class-validator";
import { ReportTypeEnum } from "../../common/enums/report.enum";

export class CreateReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reportName!: string;

  @ApiProperty({ enum: ReportTypeEnum })
  @IsNotEmpty()
  @IsEnum(ReportTypeEnum)
  reportType!: ReportTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  periodStartDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  periodEndDate?: string;
}
