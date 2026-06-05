import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Model, Connection, Types } from "mongoose";
import { DashboardSummary, DashboardSummaryDocument } from "../schemas/dashboard-summary.schema";
import { FleetAnalytics, FleetAnalyticsDocument } from "../schemas/fleet-analytics.schema";
import { GrowthAnalytics, GrowthAnalyticsDocument } from "../schemas/growth-analytics.schema";
import { Transaction, TransactionDocument } from "../schemas/transaction.schema";
import { Company, CompanyDocument } from "../schemas/company.schema";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { GetReportsDto } from "./dto/get-reports.dto";
import { ReportStatusEnum } from "../common/enums/report.enum";
import { v4 as uuidv4 } from "uuid";
import * as xlsx from "xlsx";
import { ReportSyncService } from "./report-sync.service";
import { ReportMapperService } from "./mappers/report.mapper";
import { AiService } from "../ai/ai.service";
@Injectable()
export class ReportService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(DashboardSummary.name) private dashboardModel: Model<DashboardSummaryDocument>,
    @InjectModel(FleetAnalytics.name) private fleetModel: Model<FleetAnalyticsDocument>,
    @InjectModel(GrowthAnalytics.name) private growthModel: Model<GrowthAnalyticsDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private reportSyncService: ReportSyncService,
    private readonly reportMapperService: ReportMapperService,
    private aiService: AiService,
  ) {}

  private getCollectionName(companyId: string) {
    return `company_${companyId}`;
  }



  // || ---------------------- Create report function ---------------------|| //
  async create(userId: string, company: any, file: Express.Multer.File, createReportDto: CreateReportDto) {
    if (!file) throw new BadRequestException("File is required");

    let analytics: any = {};

    try {
      if (file.path && (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheet') || file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.csv'))) {
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        if (sheetName) {
          const sheet = workbook.Sheets[sheetName];
          const csvContent = xlsx.utils.sheet_to_csv(sheet);
          
          if (csvContent && csvContent.trim().length > 0) {
            // Send CSV to Gemini LLM
            console.log("Sending report to Gemini for extraction...");
            const llmResponse = await this.aiService.extractMetricsFromReport(csvContent, company.industry);
            console.log("LLM Extracted Data:", llmResponse);
            
            // Map structured JSON to AnalyticsSchema
            analytics = this.reportMapperService.mapLlmToAnalytics(llmResponse);
          }
        }
      } else {
         // Fallback if not excel, parse whatever we can using normal mapper
         analytics = this.reportMapperService.mapToAnalytics(createReportDto.reportType, {});
      }
    } catch (e) {
      console.error("Failed to parse report file with LLM", e);
      // Fallback
      analytics = this.reportMapperService.mapToAnalytics(createReportDto.reportType, {});
    }

    let periodStartDate: Date | null = null;
    let periodEndDate: Date | null = null;

    if (createReportDto.year && createReportDto.month) {
      periodStartDate = new Date(createReportDto.year, createReportDto.month - 1, 1);
      periodEndDate = new Date(createReportDto.year, createReportDto.month, 0);
    }

    const reportData = {
      _id: uuidv4(),
      ...createReportDto, // Contains reportName, reportType, month, year, etc.
      collectionType: 'report',
      periodStartDate,
      periodEndDate,
      analytics, // Strictly typed schema
      uploadedBy: userId,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      fileExtension: file.originalname.split(".").pop()?.toLowerCase() || "",
      fileSize: file.size,
      uploadStatus: ReportStatusEnum.PROCESSING,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    const collection = this.connection.collection<any>(this.getCollectionName(company._id.toString()));
    await collection.insertOne(reportData);

    
    // Sync the merged data (from DTO and Excel) to the Dashboard, Growth, and Operational tables
    // The sync service now fetches ALL reports and aggregates them by period.
    await this.reportSyncService.syncToDashboards(company._id.toString());

    return reportData;
  }

  // || ---------------------- Get all reports function ---------------------|| //
  async findAll(userId: string, company: any, queryDto: GetReportsDto) {
    const { search, reportType, status, page, limit } = queryDto;

    const targetCollections = [this.getCollectionName(company._id.toString())];

    const matchQuery: any = { uploadedBy: userId, deletedAt: null, collectionType: 'report' };
    if (reportType) matchQuery.reportType = reportType;
    if (status) matchQuery.uploadStatus = status;
    if (search) matchQuery.reportName = { $regex: search, $options: "i" };

    let allData: any[] = [];
    for (const collName of targetCollections) {
      const collection = this.connection.collection<any>(collName);
      const docs = await collection.find(matchQuery).toArray();
      // Add id mapping
      const mappedDocs = docs.map(d => ({ ...d, _id: d._id.toString(), id: d._id.toString() }));
      allData = allData.concat(mappedDocs);
    }

    allData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (page && limit) {
      const skip = (page - 1) * limit;
      const paginatedData = allData.slice(skip, skip + limit);
      return {
        data: paginatedData,
        total: allData.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(allData.length / limit),
      };
    }

    return { data: allData, total: allData.length };
  }

  // || ---------------------- Get report by ID function ---------------------|| //
  async findOne(id: string, userId: string, company: any) {
    const collection = this.connection.collection<any>(this.getCollectionName(company._id.toString()));
    const report = await collection.findOne({ _id: id, uploadedBy: userId, deletedAt: null, collectionType: 'report' });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    const round2 = (val: number | null | undefined) => val != null ? parseFloat(Number(val).toFixed(2)) : 0;
    
    // Use strict analytics schema
    const analytics = report.analytics || { financial: {}, growth: {}, operational: {} };
    const fin = analytics.financial || {};

    return {
      reportInfo: {
        id: report._id.toString(),
        name: report.reportName,
        type: report.reportType,
        status: report.uploadStatus,
        periodStartDate: report.periodStartDate,
        periodEndDate: report.periodEndDate,
        uploadedAt: report.createdAt,
        originalFileName: report.originalFileName,
      },
      summaryCards: {
        totalRevenue: round2(fin.revenue),
        totalExpenses: round2(fin.expenses),
        netProfit: round2(fin.netProfit),
        profitMargin: round2(fin.revenue > 0 ? (fin.netProfit / fin.revenue) * 100 : 0),
      },
      aiInsights: report.aiInsights || [
        { type: "neutral", title: "Report Analyzed", description: "Report data has been successfully processed." }
      ],
      comparisonWithPreviousPeriod: report.comparisonWithPreviousPeriod || {
        revenueChangePercent: 0,
        expenseChangePercent: 0,
        profitChangePercent: 0,
      },
      rawDataTable: [], // Transactions removed from schema
    };
  }

  // || ---------------------- Get Report Revenue Trend function ---------------------|| //
  async getReportRevenueTrend(id: string, period: string, userId: string, company: any) {
    const collection = this.connection.collection<any>(this.getCollectionName(company._id.toString()));
    const report = await collection.findOne({ _id: id, uploadedBy: userId, deletedAt: null, collectionType: 'report' });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    // Removed revenueTrend from schema, return empty for now
    return { revenueTrend: [] };
  }

  // || ---------------------- Get Report Expense Breakdown function ---------------------|| //
  async getReportExpenseBreakdown(id: string, period: string, userId: string, company: any) {
    const collection = this.connection.collection<any>(this.getCollectionName(company._id.toString()));
    const report = await collection.findOne({ _id: id, uploadedBy: userId, deletedAt: null, collectionType: 'report' });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    // Removed expenseBreakdown from schema, return empty for now
    return { expenseBreakdown: [] };
  }

  // || ---------------------- Update report function ---------------------|| //
  async update(id: string, userId: string, company: any, updateReportDto: UpdateReportDto) {
    const collection = this.connection.collection<any>(this.getCollectionName(company._id.toString()));
    const report = await collection.findOne({ _id: id, uploadedBy: userId, deletedAt: null, collectionType: 'report' });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);
    
    // Optional: If they are passing analytics, you might want to run it through Mapper, but DTO might just contain metadata changes
    let updatePayload: any = {
      ...updateReportDto,
      updatedAt: new Date()
    };

    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: updatePayload },
      { returnDocument: 'after' }
    );
    
    // Recalculate Dashboard since report has changed
    await this.reportSyncService.syncToDashboards(company._id.toString());
    
    return result;
  }

  // || ---------------------- Soft delete report function ---------------------|| //
  async softDelete(id: string, userId: string, company: any) {
    const collection = this.connection.collection<any>(this.getCollectionName(company._id.toString()));
    const report = await collection.findOne({ _id: id, uploadedBy: userId, deletedAt: null, collectionType: 'report' });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);
    
    await collection.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date(), uploadStatus: ReportStatusEnum.DELETED, updatedAt: new Date() } }
    );

    // Recalculate Dashboard since a report was removed
    await this.reportSyncService.syncToDashboards(company._id.toString());
  }
}
