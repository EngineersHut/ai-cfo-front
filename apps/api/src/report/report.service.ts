import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Model, Connection, Types } from "mongoose";
import {
  DashboardSummary,
  DashboardSummaryDocument,
} from "../schemas/dashboard-summary.schema";
import {
  FleetAnalytics,
  FleetAnalyticsDocument,
} from "../schemas/fleet-analytics.schema";
import {
  GrowthAnalytics,
  GrowthAnalyticsDocument,
} from "../schemas/growth-analytics.schema";
import {
  Transaction,
  TransactionDocument,
} from "../schemas/transaction.schema";
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
import { NotificationService } from '../notification/notification.service';
@Injectable()
export class ReportService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(DashboardSummary.name)
    private dashboardModel: Model<DashboardSummaryDocument>,
    @InjectModel(FleetAnalytics.name)
    private fleetModel: Model<FleetAnalyticsDocument>,
    @InjectModel(GrowthAnalytics.name)
    private growthModel: Model<GrowthAnalyticsDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private reportSyncService: ReportSyncService,
    private readonly reportMapperService: ReportMapperService,
    private aiService: AiService,
    private notificationService: NotificationService,
  ) {}

  private getCollectionName(companyId: string) {
    return `company_${companyId}`;
  }

  // || ---------------------- Create report function ---------------------|| //
  async create(
    userId: string,
    company: any,
    file: Express.Multer.File,
    createReportDto: CreateReportDto,
  ) {
    if (!file) throw new BadRequestException("File is required");

    let periodStartDate: Date | null = null;
    let periodEndDate: Date | null = null;
    let dbMonth: number | null = null;
    let dbYear: number | null = null;

    if (createReportDto.year != null && createReportDto.month != null) {
      const parsedYear = parseInt(createReportDto.year as any, 10);
      const parsedMonthOneIndexed = parseInt(createReportDto.month as any, 10);

      dbYear = parsedYear;
      dbMonth = parsedMonthOneIndexed; // Frontend sends 1-indexed (e.g. 1 for Jan, 6 for June)

      periodStartDate = new Date(parsedYear, parsedMonthOneIndexed - 1, 1);
      periodEndDate = new Date(parsedYear, parsedMonthOneIndexed, 0);
    }

    const reportId = uuidv4();
    const reportData = {
      _id: reportId,
      ...createReportDto, // Contains reportName, reportType, etc.
      month: dbMonth !== null ? dbMonth : undefined, // Override DTO's string with number
      year: dbYear !== null ? dbYear : undefined, // Override DTO's string with number
      collectionType: "report",
      periodStartDate,
      periodEndDate,
      analytics: {}, // Strictly typed schema
      aiInsights: [], // Dynamically extracted insights from LLM
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
      deletedAt: null,
    };

    const collection = this.connection.collection<any>(
      this.getCollectionName(company._id.toString()),
    );
    await collection.insertOne(reportData);

    // Run background task without awaiting so API responds immediately
    this.processReportBackground(
      userId,
      company,
      file,
      createReportDto,
      reportId,
      dbMonth !== null ? dbMonth : undefined,
      dbYear !== null ? dbYear : undefined,
    ).catch((e) => {
      console.error("Background report processing failed", e);
    });

    // Notify user that report is processing
    await this.notificationService.createNotification(
      userId,
      'Report Processing',
      `Your report "${createReportDto.reportName}" is currently being analyzed.`,
      'INFO'
    );

    return reportData;
  }

  private async processReportBackground(
    userId: string,
    company: any,
    file: Express.Multer.File,
    createReportDto: CreateReportDto,
    reportId: string,
    dbMonth?: number,
    dbYear?: number,
  ) {
    const collection = this.connection.collection<any>(
      this.getCollectionName(company._id.toString()),
    );

    let analytics: any = {};
    let aiInsights: any[] = [];
    let status = ReportStatusEnum.ANALYZED;

    try {
      if (
        file.path &&
        (file.mimetype.includes("excel") ||
          file.mimetype.includes("spreadsheet") ||
          file.originalname.endsWith(".xlsx") ||
          file.originalname.endsWith(".csv"))
      ) {
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        if (sheetName) {
          const sheet = workbook.Sheets[sheetName];
          const csvContent = xlsx.utils.sheet_to_csv(sheet);

          if (csvContent && csvContent.trim().length > 0) {
            // Send CSV to LLM
            console.log("Sending report to Claude for extraction...");
            const llmResponse = await this.aiService.extractMetricsFromReport(
              csvContent,
              company.industry,
            );
            console.log("LLM Extracted Data:", llmResponse);

            // Map structured JSON to AnalyticsSchema
            analytics = this.reportMapperService.mapLlmToAnalytics(llmResponse);
            aiInsights = llmResponse.aiInsights || [];
          }
        }
      } else {
        // Fallback if not excel, parse whatever we can using normal mapper
        analytics = this.reportMapperService.mapToAnalytics(
          createReportDto.reportType,
          {},
        );
      }
    } catch (e) {
      console.error("Failed to parse report file with LLM", e);
      status = ReportStatusEnum.FAILED;
      analytics = this.reportMapperService.mapToAnalytics(
        createReportDto.reportType,
        {},
      );
    }

    // Save extracted metrics immediately, but DO NOT change status yet
    // because dashboard sync needs this data to run, and we want to keep
    // the frontend status as "Processing" until sync completes.
    await collection.updateOne(
      { _id: reportId },
      {
        $set: {
          analytics,
          aiInsights,
          updatedAt: new Date(),
        },
      },
    );

    // Run dashboard sync
    try {
      await this.reportSyncService.syncToDashboards(
        company._id.toString(),
        dbMonth,
        dbYear,
      );
    } catch (syncError) {
      console.error("Failed to sync dashboards in background", syncError);
      // If dashboard sync fails, we mark the report as failed so the user knows
      status = ReportStatusEnum.FAILED;
    }

    // Finally, mark as ANALYZED (or FAILED if something went wrong)
    await collection.updateOne(
      { _id: reportId },
      {
        $set: {
          uploadStatus: status,
          updatedAt: new Date(),
        },
      },
    );

    // Notify user of completion
    if (status === ReportStatusEnum.ANALYZED) {
      await this.notificationService.createNotification(
        userId,
        'Report Analyzed',
        `Analysis for "${createReportDto.reportName}" has been successfully completed.`,
        'SUCCESS'
      );
    } else {
      await this.notificationService.createNotification(
        userId,
        'Report Analysis Failed',
        `We encountered an error while analyzing "${createReportDto.reportName}".`,
        'ERROR'
      );
    }
  }

  // || ---------------------- Get all reports function ---------------------|| //
  async findAll(userId: string, company: any, queryDto: GetReportsDto) {
    const { search, reportType, status, page, limit } = queryDto;

    const targetCollections = [this.getCollectionName(company._id.toString())];

    const matchQuery: any = {
      uploadedBy: userId,
      deletedAt: null,
      collectionType: "report",
    };
    if (reportType) matchQuery.reportType = reportType;
    if (status) matchQuery.uploadStatus = status;
    if (search) matchQuery.reportName = { $regex: search, $options: "i" };

    let allData: any[] = [];
    for (const collName of targetCollections) {
      const collection = this.connection.collection<any>(collName);
      const docs = await collection.find(matchQuery).toArray();
      // Add id mapping
      const mappedDocs = docs.map((d) => ({
        ...d,
        _id: d._id.toString(),
        id: d._id.toString(),
      }));
      allData = allData.concat(mappedDocs);
    }

    allData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

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
    const companyId = company._id.toString();
    const collection = this.connection.collection<any>(
      this.getCollectionName(companyId),
    );
    const report = await collection.findOne({
      _id: id,
      uploadedBy: userId,
      deletedAt: null,
      collectionType: "report",
    });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    const round2 = (val: number | null | undefined) =>
      val != null ? parseFloat(Number(val).toFixed(2)) : 0;

    // Use strict analytics schema
    const analytics = report.analytics || {
      financial: {},
      growth: {},
      operational: {},
    };
    const fin = analytics.financial || {};

    // Dynamic AI Insights and Comparison logic
    let aiInsights = report.aiInsights;
    let comparison = report.comparisonWithPreviousPeriod;

    let rMonth = report.month;
    let rYear = report.year;

    if (!rMonth || !rYear) {
      if (report.periodStartDate) {
        rMonth = new Date(report.periodStartDate).getMonth() + 1;
        rYear = new Date(report.periodStartDate).getFullYear();
      } else if (report.createdAt) {
        rMonth = new Date(report.createdAt).getMonth() + 1;
        rYear = new Date(report.createdAt).getFullYear();
      }
    }

    if (rMonth && rYear) {
      // Fetch GrowthAnalytics for Insights
      const growthData = await this.growthModel
        .findOne({ companyId, month: rMonth, year: rYear })
        .exec();
      if (growthData && growthData.insights && growthData.insights.length > 0) {
        aiInsights = growthData.insights.map((i) => ({
          type: "neutral", // Can be dynamic if we add sentiment analysis later
          title: i.title || "Insight",
          description: i.description,
        }));
      }

      // Calculate Comparison with Previous Period dynamically
      if (!comparison) {
        const currentMonthData = await this.dashboardModel
          .findOne({ companyId, month: rMonth, year: rYear })
          .exec();

        let prevMonth = rMonth - 1;
        let prevYear = rYear;
        if (prevMonth === 0) {
          prevMonth = 12;
          prevYear -= 1;
        }
        const prevMonthData = await this.dashboardModel
          .findOne({ companyId, month: prevMonth, year: prevYear })
          .exec();

        if (currentMonthData) {
          const calcChange = (curr: number | null, prev: number | null) => {
            if (!prev || prev === 0)
              return curr && curr > 0 ? 100 : curr && curr < 0 ? -100 : 0;
            return (((curr || 0) - prev) / Math.abs(prev)) * 100;
          };

          comparison = {
            revenueChangePercent: round2(
              calcChange(currentMonthData.revenue, prevMonthData?.revenue || 0),
            ),
            expenseChangePercent: round2(
              calcChange(
                currentMonthData.totalExpenses,
                prevMonthData?.totalExpenses || 0,
              ),
            ),
            profitChangePercent: round2(
              calcChange(
                currentMonthData.netProfit,
                prevMonthData?.netProfit || 0,
              ),
            ),
          };
        }
      }
    }

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
        profitMargin: round2(fin.netProfitMarginPercent || 0),
      },
      aiInsights: aiInsights || [],
      comparisonWithPreviousPeriod: comparison || {
        revenueChangePercent: 0,
        expenseChangePercent: 0,
        profitChangePercent: 0,
      },
      rawDataTable: comparison
        ? (
            await this.dashboardModel
              .findOne({ companyId, month: rMonth, year: rYear })
              .exec()
          )?.expenseBreakdown?.map((item) => ({
            category: item.name,
            value: item.value,
            percentage: item.percentage,
            tags: item.tags || "",
            note: item.note || "",
          })) || []
        : [],
    };
  }

  // || ---------------------- Get Report Revenue Trend function ---------------------|| //
  async getReportRevenueTrend(
    id: string,
    period: string,
    userId: string,
    company: any,
  ) {
    const companyId = company._id.toString();
    const collection = this.connection.collection<any>(
      this.getCollectionName(companyId),
    );
    const report = await collection.findOne({
      _id: id,
      uploadedBy: userId,
      deletedAt: null,
      collectionType: "report",
    });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    if (period === "monthly") {
      const dashboardData = await this.dashboardModel
        .find({ companyId })
        .sort({ year: 1, month: 1 })
        .limit(12)
        .exec();

      const revenueTrend = dashboardData.map((d) => {
        const monthName = new Date(
          d.year || 0,
          (d.month || 1) - 1,
        ).toLocaleString("default", { month: "short" });
        return {
          label: monthName,
          revenue: d.revenue || 0,
          netProfit: d.netProfit || 0,
        };
      });

      return { revenueTrend };
    }

    if (period === "weekly") {
      const twelveWeeksAgo = new Date();
      twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7);

      const transactions = await this.transactionModel
        .find({
          companyId,
          date: { $gte: twelveWeeksAgo },
        })
        .sort({ date: 1 })
        .exec();

      if (transactions.length > 0) {
        const weeklyMap = new Map<
          string,
          { revenue: number; netProfit: number }
        >();
        for (const t of transactions) {
          const d = new Date(t.date);
          const weekStart = new Date(d.setDate(d.getDate() - d.getDay()));
          const label = `${weekStart.toLocaleString("default", { month: "short" })} ${weekStart.getDate()}`;

          if (!weeklyMap.has(label)) {
            weeklyMap.set(label, { revenue: 0, netProfit: 0 });
          }

          const entry = weeklyMap.get(label)!;
          // Basic logic: assuming INCOME adds to revenue and profit, EXPENSE subtracts from profit
          const typeStr = (t.type || "").toUpperCase();
          if (typeStr.includes("INCOME") || typeStr.includes("REVENUE")) {
            entry.revenue += t.amount;
            entry.netProfit += t.amount;
          } else {
            entry.netProfit -= t.amount;
          }
        }
        return {
          revenueTrend: Array.from(weeklyMap.entries()).map(
            ([label, data]) => ({
              label,
              revenue: data.revenue,
              netProfit: data.netProfit,
            }),
          ),
        };
      } else {
        // Fallback: Mock weekly data from the last 3 months of dashboard data
        const recentMonths = await this.dashboardModel
          .find({ companyId })
          .sort({ year: -1, month: -1 })
          .limit(3)
          .exec();
        const fallbackTrend = [];
        for (const m of recentMonths.reverse()) {
          const monthName = new Date(
            m.year || 0,
            (m.month || 1) - 1,
          ).toLocaleString("default", { month: "short" });
          for (let w = 1; w <= 4; w++) {
            fallbackTrend.push({
              label: `${monthName} W${w}`,
              revenue: Math.round((m.revenue || 0) / 4),
              netProfit: Math.round((m.netProfit || 0) / 4),
            });
          }
        }
        return { revenueTrend: fallbackTrend };
      }
    }

    return { revenueTrend: [] };
  }

  // || ---------------------- Get Report Expense Breakdown function ---------------------|| //
  async getReportExpenseBreakdown(
    id: string,
    period: string,
    userId: string,
    company: any,
  ) {
    const companyId = company._id.toString();
    const collection = this.connection.collection<any>(
      this.getCollectionName(companyId),
    );
    const report = await collection.findOne({
      _id: id,
      uploadedBy: userId,
      deletedAt: null,
      collectionType: "report",
    });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    // Fetch the latest dashboard summary to get a base "totalExpenses" figure
    const latestDashboard = await this.dashboardModel
      .findOne({ companyId })
      .sort({ year: -1, month: -1 })
      .exec();

    let baseExpenses = latestDashboard?.totalExpenses || 0;
    let breakdown = latestDashboard?.expenseBreakdown || [];

    if (period === "weekly") {
      baseExpenses = Math.round(baseExpenses / 4);
      breakdown = breakdown.map((b) => ({
        ...b,
        value: Math.round(b.value / 4),
      }));
    }

    // Assign UI colors dynamically to the categories returned by AI
    const colors = [
      "#4f46e5",
      "#e11d48",
      "#f59e0b",
      "#84cc16",
      "#06b6d4",
      "#a855f7",
    ];
    const expenseBreakdown = breakdown.map((b, index) => ({
      name: b.name,
      value: b.value,
      percentage: b.percentage,
      color: colors[index % colors.length],
    }));

    return { expenseBreakdown, totalExpenses: baseExpenses };
  }

  // || ---------------------- Update report function ---------------------|| //
  async update(
    id: string,
    userId: string,
    company: any,
    updateReportDto: UpdateReportDto,
  ) {
    const collection = this.connection.collection<any>(
      this.getCollectionName(company._id.toString()),
    );
    const report = await collection.findOne({
      _id: id,
      uploadedBy: userId,
      deletedAt: null,
      collectionType: "report",
    });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    // Optional: If they are passing analytics, you might want to run it through Mapper, but DTO might just contain metadata changes
    let updatePayload: any = {
      ...updateReportDto,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: updatePayload },
      { returnDocument: "after" },
    );

    // Recalculate Dashboard since report has changed
    const rMonth = updatePayload.month || report.month;
    const rYear = updatePayload.year || report.year;
    await this.reportSyncService.syncToDashboards(
      company._id.toString(),
      rMonth,
      rYear,
    );

    return result;
  }

  // || ---------------------- Soft delete report function ---------------------|| //
  async softDelete(id: string, userId: string, company: any) {
    const collection = this.connection.collection<any>(
      this.getCollectionName(company._id.toString()),
    );
    const report = await collection.findOne({
      _id: id,
      uploadedBy: userId,
      deletedAt: null,
      collectionType: "report",
    });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    await collection.updateOne(
      { _id: id },
      {
        $set: {
          deletedAt: new Date(),
          uploadStatus: ReportStatusEnum.DELETED,
          updatedAt: new Date(),
        },
      },
    );

    // Recalculate Dashboard since a report was removed
    const reportMonth = report.month || (report.periodStartDate ? new Date(report.periodStartDate).getMonth() + 1 : (report.createdAt ? new Date(report.createdAt).getMonth() + 1 : new Date().getMonth() + 1));
    const reportYear = report.year || (report.periodStartDate ? new Date(report.periodStartDate).getFullYear() : (report.createdAt ? new Date(report.createdAt).getFullYear() : new Date().getFullYear()));

    // Find remaining reports for this month
    const allReports = await collection.find({ collectionType: "report", deletedAt: null }).toArray();
    const remainingReportIds = allReports.filter(r => {
      const m = r.month || (r.periodStartDate ? new Date(r.periodStartDate).getMonth() + 1 : (r.createdAt ? new Date(r.createdAt).getMonth() + 1 : new Date().getMonth() + 1));
      const y = r.year || (r.periodStartDate ? new Date(r.periodStartDate).getFullYear() : (r.createdAt ? new Date(r.createdAt).getFullYear() : new Date().getFullYear()));
      return m === reportMonth && y === reportYear && r._id.toString() !== id;
    }).map(r => r._id);

    if (remainingReportIds.length > 0) {
      // Return a flag indicating re-analysis is happening
    }

    // Run sync in background
    this.reportSyncService.syncToDashboards(
      company._id.toString(),
      reportMonth,
      reportYear,
    ).then(async () => {
      if (remainingReportIds.length > 0) {
        await this.notificationService.createNotification(
          userId,
          'Re-analysis Complete',
          `Data for ${reportMonth}/${reportYear} has been re-analyzed successfully.`,
          'SUCCESS'
        );
      }
    }).catch(async (e) => {
      console.error("Failed to re-sync dashboards after delete", e);
    });

    return { success: true, message: "Report deleted successfully", reanalyzing: remainingReportIds.length > 0 };
  }
}
