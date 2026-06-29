import { PartialType, PickType } from "@nestjs/swagger";
import { CreateReportDto } from "./create-report.dto";

export class UpdateReportDto extends PartialType(
  PickType(CreateReportDto, [
    "reportName",
    "reportType",
    "month",
    "year",
    "analytics",
  ] as const),
) {}
