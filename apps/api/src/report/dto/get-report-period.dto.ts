import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export enum ReportPeriodFilterEnum {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export class GetReportPeriodFilterDto {
  @ApiPropertyOptional({
    description: "Filter period for the data",
    enum: ReportPeriodFilterEnum,
    default: ReportPeriodFilterEnum.MONTHLY,
  })
  @IsOptional()
  @IsEnum(ReportPeriodFilterEnum)
  period?: ReportPeriodFilterEnum;
}
