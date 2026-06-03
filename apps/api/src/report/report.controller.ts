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
} from "@nestjs/common";
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
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ReportFileInterceptor } from "../common/helpers/multer-config";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
        companyId: { type: "string" },
        reportName: { type: "string" },
        reportType: { type: "string" },
        periodStartDate: { type: "string", format: "date", nullable: true },
        periodEndDate: { type: "string", format: "date", nullable: true },
      },
    },
  })
  create(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.create(
      req.user._id || req.user.id,
      file,
      createReportDto,
    );
  }

  // || ---------------------- Get All Reports API ---------------------|| //
  @Get()
  @ApiOperation({
    summary: "Get all reports with optional filtering and pagination",
  })
  findAll(@Request() req: any, @Query() queryDto: GetReportsDto) {
    return this.reportService.findAll(req.user._id || req.user.id, queryDto);
  }

  // || ---------------------- Get Report By ID API ---------------------|| //
  @Get(":id")
  @ApiOperation({
    summary: "Get a specific report by ID",
  })
  findOne(@Param("id") id: string, @Request() req: any) {
    return this.reportService.findOne(id, req.user._id || req.user.id);
  }

  // || ---------------------- Update Report API ---------------------|| //
  @Patch(":id")
  @ApiOperation({
    summary: "Update report metadata",
  })
  update(
    @Param("id") id: string,
    @Request() req: any,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportService.update(
      id,
      req.user._id || req.user.id,
      updateReportDto,
    );
  }

  // || ---------------------- Delete Report API ---------------------|| //
  @Delete(":id")
  @ApiOperation({
    summary: "Soft delete a report",
  })
  remove(@Param("id") id: string, @Request() req: any) {
    return this.reportService.softDelete(id, req.user._id || req.user.id);
  }
}
