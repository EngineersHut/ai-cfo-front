import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Sse,
  MessageEvent,
} from "@nestjs/common";
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { GetReportsDto } from "./dto/get-reports.dto";
import { GetReportPeriodFilterDto } from "./dto/get-report-period.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CompanyGuard } from "../auth/guards/company.guard";
import { CompanyOptional, CurrentCompany } from "../common/decorators/company.decorator";
import { ReportFileInterceptor } from "../common/helpers/multer-config";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // || ---------------------- Upload Report API ---------------------|| //
  @Post()
  @UseInterceptors(ReportFileInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Upload a new financial report",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        reportName: { type: "string" },
        reportType: { type: "string" },
        month: { type: "number", nullable: true, example: 10 },
        year: { type: "number", nullable: true, example: 2026 },
      },
    },
  })
  create(
    @Request() req: any,
    @CurrentCompany() company: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.create(
      req.user._id || req.user.id,
      company,
      file,
      createReportDto,
    );
  }

  // || ---------------------- Get All Reports API ---------------------|| //
  @Get()
  @CompanyOptional()
  @ApiOperation({
    summary: "Get all reports with optional filtering and pagination",
  })
  findAll(@Request() req: any, @CurrentCompany() company: any, @Query() queryDto: GetReportsDto) {
    if (!company) {
      return { data: [], total: 0 };
    }
    return this.reportService.findAll(req.user._id || req.user.id, company, queryDto);
  }

  // || ---------------------- SSE Report Status Stream API ---------------------|| //
  @Sse("status-stream")
  @ApiOperation({
    summary: "Stream report processing updates via Server-Sent Events",
  })
  streamStatus(@CurrentCompany() company: any): Observable<MessageEvent> {
    const companyId = company?._id?.toString() || company?.id;
    return this.reportService.reportStatus$.asObservable().pipe(
      filter((event) => event.companyId === companyId),
      map((event) => ({
        data: event,
      } as MessageEvent))
    );
  }

  // || ---------------------- Get Report By ID API ---------------------|| //
  @Get(":reportId")
  @ApiOperation({
    summary: "Get frontend-ready report details by ID",
  })
  findOne(@Param("reportId") reportId: string, @Request() req: any, @CurrentCompany() company: any) {
    return this.reportService.findOne(reportId, req.user._id || req.user.id, company);
  }

  // || ---------------------- Get Report Revenue Trend API ---------------------|| //
  @Get(":reportId/revenue-trend")
  @ApiOperation({
    summary: "Get report revenue trend with period filter",
  })
  getRevenueTrend(
    @Param("reportId") reportId: string, 
    @Query() queryDto: GetReportPeriodFilterDto,
    @Request() req: any,
    @CurrentCompany() company: any
  ) {
    return this.reportService.getReportRevenueTrend(reportId, queryDto.period || "monthly", req.user._id || req.user.id, company);
  }

  // || ---------------------- Get Report Expense Breakdown API ---------------------|| //
  @Get(":reportId/expense-breakdown")
  @ApiOperation({
    summary: "Get report expense breakdown with period filter",
  })
  getExpenseBreakdown(
    @Param("reportId") reportId: string, 
    @Query() queryDto: GetReportPeriodFilterDto,
    @Request() req: any,
    @CurrentCompany() company: any
  ) {
    return this.reportService.getReportExpenseBreakdown(reportId, queryDto.period || "monthly", req.user._id || req.user.id, company);
  }

  // || ---------------------- Update Report API ---------------------|| //
  @Patch(":id")
  @ApiOperation({
    summary: "Update report metadata",
  })
  update(
    @Param("id") id: string,
    @Request() req: any,
    @CurrentCompany() company: any,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportService.update(
      id,
      req.user._id || req.user.id,
      company,
      updateReportDto,
    );
  }

  // || ---------------------- Delete Report API ---------------------|| //
  @Delete(":id")
  @ApiOperation({
    summary: "Soft delete a report",
  })
  remove(@Param("id") id: string, @Request() req: any, @CurrentCompany() company: any) {
    return this.reportService.softDelete(id, req.user._id || req.user.id, company);
  }
}
