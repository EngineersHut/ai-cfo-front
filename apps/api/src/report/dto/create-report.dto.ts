import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
} from "class-validator";
import { Transform } from "class-transformer";
import { ReportTypeEnum } from "../../common/enums/report.enum";

export class CreateReportDto {
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
  month?: number;

  @ApiPropertyOptional()
  @IsOptional()
  year?: number;

  // --- Financial & Growth Data (Optional, mapped from Excel or passed from frontend) ---
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value;
    } catch (e) {
      return value;
    }
  })
  analytics?: any;
}
