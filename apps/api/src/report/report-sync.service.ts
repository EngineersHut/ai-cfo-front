import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as fs from "fs";
import * as xlsx from "xlsx";
import {
  DashboardSummary,
  DashboardSummaryDocument,
} from "../schemas/dashboard-summary.schema";
import {
  GrowthAnalytics,
  GrowthAnalyticsDocument,
} from "../schemas/growth-analytics.schema";
import {
  FleetAnalytics,
  FleetAnalyticsDocument,
} from "../schemas/fleet-analytics.schema";
import { Company, CompanyDocument } from "../schemas/company.schema";
import { AiService } from "../ai/ai.service";
import {
  BudgetPlanning,
  BudgetPlanningDocument,
} from "../schemas/budget-planning.schema";

@Injectable()
export class ReportSyncService {
  constructor(
    @InjectModel(DashboardSummary.name)
    private dashboardModel: Model<DashboardSummaryDocument>,
    @InjectModel(GrowthAnalytics.name)
    private growthModel: Model<GrowthAnalyticsDocument>,
    @InjectModel(FleetAnalytics.name)
    private fleetModel: Model<FleetAnalyticsDocument>,
    @InjectModel(BudgetPlanning.name)
    private budgetModel: Model<BudgetPlanningDocument>,
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
    private aiService: AiService,
  ) {}

  // || ---------------------- Sync data to Dashboards function ---------------------|| //
  async syncToDashboards(companyId: string, targetMonth?: number, targetYear?: number) {
    // 1. Fetch all active reports for this company
    const collection = this.dashboardModel.db.collection(
      `company_${companyId}`,
    );
    const reports = await collection
      .find({ collectionType: "report", deletedAt: null })
      .toArray();

    // Aggregation maps to group reports by year and month
    const monthlyMap = new Map<string, any>();

    // Clean up only legacy dashboard/analytics records (which have the 'periodType' field) to avoid schema conflicts
    await Promise.all([
      this.dashboardModel.deleteMany({
        companyId,
        $or: [
          { periodType: { $exists: true } },
          { month: null },
          { year: null },
        ],
      }),
      this.growthModel.deleteMany({
        companyId,
        $or: [
          { periodType: { $exists: true } },
          { month: null },
          { year: null },
        ],
      }),
      this.fleetModel.deleteMany({
        companyId,
        $or: [
          { periodType: { $exists: true } },
          { month: null },
          { year: null },
        ],
      }),
    ]);

    const company = await this.companyModel.findById(companyId);
    const industry = company?.industry || "Generic";

    // Group reports by year-month
    const monthlyReportsMap = new Map<string, any[]>();
    for (const report of reports) {
      if (report.periodStartDate && report.periodEndDate) {
        let currentYear = new Date(report.periodStartDate).getFullYear();
        let currentMonth = new Date(report.periodStartDate).getMonth() + 1;
        const endYear = new Date(report.periodEndDate).getFullYear();
        const endMonth = new Date(report.periodEndDate).getMonth() + 1;

        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
          if (targetMonth && targetYear && (currentMonth !== targetMonth || currentYear !== targetYear)) {
            // skip
          } else {
            const key = `${currentYear}-${currentMonth}`;
            if (!monthlyReportsMap.has(key)) {
              monthlyReportsMap.set(key, []);
            }
            monthlyReportsMap.get(key)!.push(report);
          }
          currentMonth++;
          if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
          }
        }
      } else {
        const month =
          report.month != null
            ? report.month
            : report.periodStartDate
              ? new Date(report.periodStartDate).getMonth() + 1
              : new Date(report.createdAt).getMonth() + 1;
        const year =
          report.year ||
          (report.periodStartDate
            ? new Date(report.periodStartDate).getFullYear()
            : new Date(report.createdAt).getFullYear());
        if (targetMonth && targetYear && (month !== targetMonth || year !== targetYear)) {
          continue;
        }

        const key = `${year}-${month}`;
        if (!monthlyReportsMap.has(key)) {
          monthlyReportsMap.set(key, []);
        }
        monthlyReportsMap.get(key)!.push(report);
      }
    }

    // Find all existing periods in dashboard to identify which ones need to be deleted
    const query: any = { companyId };
    if (targetMonth && targetYear) {
      query.month = targetMonth;
      query.year = targetYear;
    }

    const existingDashboards = await this.dashboardModel
      .find(query, { year: 1, month: 1 })
      .lean();
    const existingKeys = new Set(
      existingDashboards
        .filter((d) => d.year && d.month)
        .map((d) => `${d.year}-${d.month}`),
    );

    // Delete data for periods that no longer have any active reports
    for (const existingKey of existingKeys) {
      if (!monthlyReportsMap.has(existingKey)) {
        const [yearStr, monthStr] = existingKey.split("-");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);

        await Promise.all([
          this.dashboardModel.deleteMany({ companyId, month, year }),
          this.growthModel.deleteMany({ companyId, month, year }),
          this.fleetModel.deleteMany({ companyId, month, year }),
          this.budgetModel.deleteMany({ companyId, month, year }),
        ]);
        console.log(
          `Deleted dashboard data for ${companyId} month ${existingKey} as no reports remain.`,
        );
      }
    }

    // Group months into batches based on identical report lists to minimize AI calls
    const batches = new Map<string, { months: {month: number, year: number}[], reports: any[] }>();

    for (const [key, monthReports] of monthlyReportsMap.entries()) {
      const [yearStr, monthStr] = key.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      
      // Create signature based on report _ids
      const signature = monthReports.map(r => r._id.toString()).sort().join(',');
      
      if (!batches.has(signature)) {
        batches.set(signature, { months: [], reports: monthReports });
      }
      batches.get(signature)!.months.push({ month, year });
    }

    // Process each batch using LLM consolidation
    for (const batch of batches.values()) {
      // Read content for all reports of this batch
      const reportsData = batch.reports
        .map((report) => ({
          name: report.reportName || "Unnamed Report",
          content: this.getReportContent(
            report.filePath,
            report.mimeType || "",
          ),
        }))
        .filter((r) => r.content && r.content.trim().length > 0);

      if (reportsData.length === 0) {
        continue;
      }

      if (batch.months.length === 1) {
        // Single month batch - call the standard monthly AI method
        const m = batch.months[0];
        try {
          console.log(
            `Consolidating ${reportsData.length} reports for single month ${m.year}-${m.month} using Gemini...`,
          );
          const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const targetMonthName = MONTH_NAMES[m.month - 1];

          const consolidated =
            await this.aiService.generateConsolidatedMonthlyMetrics(
              reportsData,
              industry,
              targetMonthName,
              m.year
            );

          await this.upsertSingleConsolidated(
            companyId,
            m.month,
            m.year,
            consolidated,
          );
        } catch (error) {
          console.error(`Failed to consolidate reports for single month ${m.year}-${m.month}`, error);
        }
      } else {
        // Multi-month batch - call the new batch AI method
        try {
          console.log(
            `Consolidating ${reportsData.length} reports for ${batch.months.length} months in batch using Gemini...`,
          );
          
          const consolidatedBatch =
            await this.aiService.generateConsolidatedMultiMonthMetrics(
              reportsData,
              industry,
              batch.months
            );

          if (consolidatedBatch && consolidatedBatch.monthlyData) {
            for (const data of consolidatedBatch.monthlyData) {
              await this.upsertSingleConsolidated(
                companyId,
                data.month,
                data.year,
                data,
              );
            }
          }
        } catch (error) {
          console.error(`Failed to consolidate reports for multi-month batch`, error);
        }
      }
    }
  }

  // || ---------------------- Insert Yearly Breakdown ---------------------|| //
  async insertYearlyBreakdown(companyId: string, months: any[]) {
    if (!months || !Array.isArray(months) || months.length === 0) return;
    
    console.log(`Inserting yearly breakdown for ${months.length} months into dashboards...`);
    
    for (const m of months) {
      if (m.month && m.year) {
        try {
          await this.upsertSingleConsolidated(companyId, m.month, m.year, m);
        } catch (error) {
          console.error(`Failed to insert yearly breakdown for month ${m.month}/${m.year}`, error);
        }
      }
    }
  }

  // --- Helper Methods ---

  private getReportContent(filePath: string, mimeType: string): string {
    try {
      if (!filePath || !fs.existsSync(filePath)) {
        return "";
      }
      if (
        mimeType.includes("excel") ||
        mimeType.includes("spreadsheet") ||
        filePath.endsWith(".xlsx")
      ) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        if (sheetName) {
          const sheet = workbook.Sheets[sheetName];
          return xlsx.utils.sheet_to_csv(sheet);
        }
      } else {
        return fs.readFileSync(filePath, "utf-8");
      }
    } catch (error) {
      console.error(`Failed to read report file at ${filePath}`, error);
    }
    return "";
  }

  private async upsertSingleConsolidated(
    companyId: string,
    month: number,
    year: number,
    consolidated: any,
  ) {
    const periodStartDate = new Date(year, month - 1, 1);
    const periodEndDate = new Date(year, month, 0);

    const dashboardPayload = {
      companyId,
      month,
      year,
      periodStartDate,
      periodEndDate,
      revenue: consolidated.dashboardSummary?.revenue ?? null,
      grossProfit: consolidated.dashboardSummary?.grossProfit ?? null,
      netProfit: consolidated.dashboardSummary?.netProfit ?? null,
      ebitda: consolidated.dashboardSummary?.ebitda ?? null,
      totalExpenses: consolidated.dashboardSummary?.totalExpenses ?? null,
      cashBalance: consolidated.dashboardSummary?.cashBalance ?? null,
      cashInflow: consolidated.dashboardSummary?.cashInflow ?? null,
      cashOutflow: consolidated.dashboardSummary?.cashOutflow ?? null,
      netCashFlow: consolidated.dashboardSummary?.netCashFlow ?? null,
      grossMarginPercent:
        consolidated.dashboardSummary?.grossMarginPercent ?? null,
      netProfitMarginPercent:
        consolidated.dashboardSummary?.netProfitMarginPercent ?? null,
      ebitdaMarginPercent:
        consolidated.dashboardSummary?.ebitdaMarginPercent ?? null,
      expenseBreakdown: consolidated.dashboardSummary?.expenseBreakdown ?? [],
      financialHealthScore:
        consolidated.dashboardSummary?.financialHealthScore ?? null,
      auditCompliance: consolidated.dashboardSummary?.auditCompliance ?? null,
      growthPercent: consolidated.dashboardSummary?.growthPercent ?? null,
      equityHealth: consolidated.dashboardSummary?.equityHealth ?? null,
    };

    const growthPayload = {
      companyId,
      month,
      year,
      periodStartDate,
      periodEndDate,
      clientCount: consolidated.growthAnalytics?.clientCount ?? null,
      newClients: consolidated.growthAnalytics?.newClients ?? null,
      employeeCount: consolidated.growthAnalytics?.employeeCount ?? null,
      monthlyGrowthPercent:
        consolidated.growthAnalytics?.monthlyGrowthPercent ?? null,
      quarterlyGrowthPercent:
        consolidated.growthAnalytics?.quarterlyGrowthPercent ?? null,
      yearlyGrowthPercent:
        consolidated.growthAnalytics?.yearlyGrowthPercent ?? null,
      revenuePerClient: consolidated.growthAnalytics?.revenuePerClient ?? null,
      revenuePerEmployee:
        consolidated.growthAnalytics?.revenuePerEmployee ?? null,
      employeeGrowthPercent:
        consolidated.growthAnalytics?.employeeGrowthPercent ?? null,
      clientGrowthPercent:
        consolidated.growthAnalytics?.clientGrowthPercent ?? null,
      growthHealthScore:
        consolidated.growthAnalytics?.growthHealthScore ?? null,
      revenueGrowthScore:
        consolidated.growthAnalytics?.revenueGrowthScore ?? null,
      clientRetentionScore:
        consolidated.growthAnalytics?.clientRetentionScore ?? null,
      scalingEfficiencyScore:
        consolidated.growthAnalytics?.scalingEfficiencyScore ?? null,
      growthTrend: consolidated.growthAnalytics?.growthTrend ?? [],
      insights: consolidated.growthAnalytics?.insights ?? [],
    };

    const fleetPayload = {
      companyId,
      month,
      year,
      periodStartDate,
      periodEndDate,
      totalVehicles: consolidated.fleetAnalytics?.totalVehicles ?? null,
      activeVehicles: consolidated.fleetAnalytics?.activeVehicles ?? null,
      inactiveVehicles: consolidated.fleetAnalytics?.inactiveVehicles ?? null,
      fleetUtilizationPercent:
        consolidated.fleetAnalytics?.fleetUtilizationPercent ?? null,
      totalTrips: consolidated.fleetAnalytics?.totalTrips ?? null,
      completedTrips: consolidated.fleetAnalytics?.completedTrips ?? null,
      cancelledTrips: consolidated.fleetAnalytics?.cancelledTrips ?? null,
      fuelCost: consolidated.fleetAnalytics?.fuelCost ?? null,
      maintenanceCost: consolidated.fleetAnalytics?.maintenanceCost ?? null,
      costPerTrip: consolidated.fleetAnalytics?.costPerTrip ?? null,
      costPerKm: consolidated.fleetAnalytics?.costPerKm ?? null,
      totalDeliveries: consolidated.fleetAnalytics?.totalDeliveries ?? null,
      onTimeDeliveries: consolidated.fleetAnalytics?.onTimeDeliveries ?? null,
      onTimePercent: consolidated.fleetAnalytics?.onTimePercent ?? null,
      driverEfficiencyOverall:
        consolidated.fleetAnalytics?.driverEfficiencyOverall ?? null,
      costEfficiency: consolidated.fleetAnalytics?.costEfficiency ?? null,
    };

    const budgetPayload = {
      companyId,
      month,
      year,
      totalRevenueBudget: consolidated.budgetPlanning?.totalRevenueBudget ?? 0,
      totalDirectCostsBudget:
        consolidated.budgetPlanning?.totalDirectCostsBudget ?? 0,
      totalOperatingExpensesBudget:
        consolidated.budgetPlanning?.totalOperatingExpensesBudget ?? 0,
      lineItems: consolidated.budgetPlanning?.lineItems ?? [],
    };

    const query = { companyId, month, year };

    await Promise.all([
      this.dashboardModel.findOneAndUpdate(
        query,
        {
          $set: {
            ...dashboardPayload,
            // Only overwrite if it exists in the new consolidated payload
            ...(consolidated.dashboardSummary?.expenseBreakdown && {
              expenseBreakdown: consolidated.dashboardSummary.expenseBreakdown,
            }),
          },
        },
        { upsert: true, returnDocument: 'after' },
      ),
      this.growthModel.findOneAndUpdate(
        query,
        { $set: growthPayload },
        { upsert: true, returnDocument: 'after' },
      ),
      this.fleetModel.findOneAndUpdate(
        query,
        { $set: fleetPayload },
        { upsert: true, returnDocument: 'after' },
      ),
      this.budgetModel.findOneAndUpdate(
        query,
        { $set: budgetPayload },
        { upsert: true, returnDocument: 'after' },
      ),
    ]);
  }
}
