import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";
import {
  ReportTypeEnum,
  ReportStatusEnum,
} from "../../common/enums/report.enum";

export class GetReportsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({ enum: ReportTypeEnum })
  @IsOptional()
  @IsEnum(ReportTypeEnum)
  reportType?: ReportTypeEnum;

  @ApiPropertyOptional({ enum: ReportStatusEnum })
  @IsOptional()
  @IsEnum(ReportStatusEnum)
  status?: ReportStatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
