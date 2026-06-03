import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Report, ReportDocument } from "../schemas/report.schema";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { GetReportsDto } from "./dto/get-reports.dto";
import { ReportStatusEnum } from "../common/enums/report.enum";

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  // || ---------------------- Create report function ---------------------|| //
  async create(
    userId: string,
    file: Express.Multer.File,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    const createdReport = new this.reportModel({
      ...createReportDto,
      uploadedBy: userId,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      fileExtension: file.originalname.split(".").pop()?.toLowerCase() || "",
      fileSize: file.size,
      uploadStatus: ReportStatusEnum.PROCESSING,
    });

    return createdReport.save();
  }

  // || ---------------------- Get all reports function ---------------------|| //
  async findAll(userId: string, queryDto: GetReportsDto): Promise<any> {
    const { search, companyId, reportType, status, page, limit } = queryDto;

    const query: any = { uploadedBy: userId, deletedAt: null };

    if (companyId) query.companyId = companyId;
    if (reportType) query.reportType = reportType;
    if (status) query.uploadStatus = status;
    if (search) {
      query.reportName = { $regex: search, $options: "i" };
    }

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.reportModel.find(query).skip(skip).limit(limit).exec(),
        this.reportModel.countDocuments(query).exec(),
      ]);
      return {
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };
    }

    const data = await this.reportModel.find(query).exec();
    return {
      data: data,
      total: data.length,
    };
  }

  // || ---------------------- Get report by ID function ---------------------|| //
  async findOne(id: string, userId: string): Promise<Report> {
    const report = await this.reportModel
      .findOne({ _id: id, uploadedBy: userId, deletedAt: null })
      .exec();
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  // || ---------------------- Update report function ---------------------|| //
  async update(
    id: string,
    userId: string,
    updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    const updatedReport = await this.reportModel
      .findOneAndUpdate(
        { _id: id, uploadedBy: userId, deletedAt: null },
        updateReportDto,
        { new: true },
      )
      .exec();

    if (!updatedReport) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return updatedReport;
  }

  // || ---------------------- Soft delete report function ---------------------|| //
  async softDelete(id: string, userId: string): Promise<void> {
    const result = await this.reportModel
      .findOneAndUpdate(
        { _id: id, uploadedBy: userId, deletedAt: null },
        { deletedAt: new Date(), uploadStatus: ReportStatusEnum.DELETED },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
  }
}
