import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CompanyService } from "../company/company.service";
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
import { GetDashboardDto, DashboardPeriodEnum } from "./dto/get-dashboard.dto";
import { IndustryEnum } from "../common/enums/company.enum";

@Injectable()
export class DashboardService {
  constructor(
    private companyService: CompanyService,
    @InjectModel(DashboardSummary.name)
    private dashboardModel: Model<DashboardSummaryDocument>,
    @InjectModel(FleetAnalytics.name)
    private fleetModel: Model<FleetAnalyticsDocument>,
    @InjectModel(GrowthAnalytics.name)
    private growthModel: Model<GrowthAnalyticsDocument>,
  ) {}

  // || ---------------------- Get Dashboard Data function ---------------------|| //
  async getDashboard(company: any, queryDto: GetDashboardDto) {
    if (!company) {
      return this.getEmptyDashboard();
    }
    const companyId = company._id.toString();
    const { month, year } = queryDto;

    return this.getFleetDashboard(companyId, month, year);
  }

  private getEmptyDashboard() {
    return {
      summaryCards: {
        totalDeliveries: { value: 0, trend: "Stable" },
        deliveriesPerVehicle: { value: 0, trend: "Stable" },
        fleetUtilization: { value: 0, trend: "Stable" },
        driverEfficiency: { value: 0, trend: "Stable" },
        cashRunway: { value: 0, trend: "Stable" },
        growthPercent: { value: 0, trend: "Stable" },
        ebitda: { value: 0, trend: "Stable" },
        operatingCashFlow: { value: 0, trend: "Stable" },
      },
      revenueTrend: [],
      healthMeter: { score: 0, equityHealth: 0, auditCompliance: 0 },
      costEfficiency: {
        totalExpenses: { value: 0, trend: "Stable" },
        costOfRevenue: { value: 0, trend: "Stable" },
        costPerClient: { value: 0, trend: "Stable" },
        operatingExpenseRatio: { value: 0, trend: "Stable" },
        fixedCost: { value: 0, trend: "Stable" },
        variableCost: { value: 0, trend: "Stable" },
        costPerEmployee: { value: 0, trend: "Stable" },
      },
      aiInsights: [],
      cfoInsights: [],
      forecastVsReality: { percentageAchieved: 0, currentValue: 0, targetValue: 0 },
    };
  }

  // || ---------------------- Get Fleet Dashboard Data function ---------------------|| //
  private async getFleetDashboard(
    companyId: string,
    month?: number,
    year?: number,
  ) {
    // 1. Query for the single selected month / latest month
    const currentQuery: any = { companyId };
    if (year && month) {
      currentQuery.year = year;
      currentQuery.month = month;
    }

    // 2. Query for the trend (up to 12 months, ending at selected month/year)
    const trendQuery: any = { companyId };
    if (year && month) {
      trendQuery.$or = [
        { year: { $lt: year } },
        { year: year, month: { $lte: month } },
      ];
    }

    // Inject Growth model locally for this function since we need client count
    const [dashboardData, fleetData, growthData] = await Promise.all([
      this.dashboardModel
        .find(trendQuery)
        .sort({ year: -1, month: -1 })
        .limit(12)
        .exec(),
      this.fleetModel
        .find(trendQuery)
        .sort({ year: -1, month: -1 })
        .limit(2)
        .exec(),
      this.growthModel
        .find(trendQuery)
        .sort({ year: -1, month: -1 })
        .limit(2)
        .exec(),
    ]);

    const targetYear = year || (dashboardData[0]?.year as number) || new Date().getFullYear();
    const targetMonth = month || (dashboardData[0]?.month as number) || (new Date().getMonth() + 1);

    const prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
    const prevYear = targetMonth === 1 ? targetYear - 1 : targetYear;

    const currentDashboard = dashboardData.find(d => d.year === targetYear && d.month === targetMonth) || ({} as any);
    const previousDashboard = dashboardData.find(d => d.year === prevYear && d.month === prevMonth) || ({} as any);

    const summary = {
      revenue: currentDashboard.revenue || 0,
      grossProfit: currentDashboard.grossProfit || 0,
      ebitda: currentDashboard.ebitda || 0,
      totalExpenses: currentDashboard.totalExpenses || 0,
      operatingCashFlow: currentDashboard.netCashFlow || 0,
      cashBalance: currentDashboard.cashBalance || 0,
      financialHealthScore: currentDashboard.financialHealthScore || 0,
    };

    const currentFleet = fleetData.find(d => d.year === targetYear && d.month === targetMonth) || ({} as any);

    const fleetSummary = {
      totalDeliveries: currentFleet.totalDeliveries || 0,
      fleetUtilization: currentFleet.fleetUtilizationPercent || 0,
      totalVehicles: currentFleet.totalVehicles || 0,
      activeVehicles: currentFleet.activeVehicles || 0,
      inactiveVehicles: currentFleet.inactiveVehicles || 0,
      totalTrips: currentFleet.totalTrips || 0,
      completedTrips: currentFleet.completedTrips || 0,
      cancelledTrips: currentFleet.cancelledTrips || 0,
    };

    const currentGrowth = growthData.find(d => d.year === targetYear && d.month === targetMonth) || ({} as any);
    const clientCount = currentGrowth.clientCount || 0;

    // Derived Calculations
    const cashRunway =
      summary.totalExpenses > 0
        ? parseFloat((summary.cashBalance / summary.totalExpenses).toFixed(2))
        : 0;

    const growthPercent =
      currentDashboard.growthPercent !== undefined &&
      currentDashboard.growthPercent !== null
        ? currentDashboard.growthPercent
        : 0;

    const costOfRevenue = summary.revenue - summary.grossProfit;
    const costOfRevenuePercent =
      summary.revenue > 0
        ? parseFloat(((costOfRevenue / summary.revenue) * 100).toFixed(2))
        : 0;
    const costPerClient =
      clientCount > 0
        ? parseFloat((summary.totalExpenses / clientCount).toFixed(2))
        : 0;

    const equityHealth =
      currentDashboard.equityHealth !== undefined &&
      currentDashboard.equityHealth !== null
        ? currentDashboard.equityHealth
        : summary.revenue > 0 || summary.totalExpenses > 0
          ? summary.revenue > summary.totalExpenses
            ? 85
            : 40
          : 0;
    const auditCompliance =
      currentDashboard.auditCompliance !== undefined &&
      currentDashboard.auditCompliance !== null
        ? currentDashboard.auditCompliance
        : summary.revenue > 0 || summary.totalExpenses > 0
          ? 100
          : 0;

    const driverEfficiencyOverall =
      currentFleet.driverEfficiencyOverall !== undefined &&
      currentFleet.driverEfficiencyOverall !== null
        ? currentFleet.driverEfficiencyOverall
        : 0;

    const financialHealthScore =
      currentDashboard.financialHealthScore !== undefined &&
      currentDashboard.financialHealthScore !== null &&
      currentDashboard.financialHealthScore > 0
        ? currentDashboard.financialHealthScore
        : (() => {
            if (summary.revenue === 0 && summary.totalExpenses === 0 && summary.cashBalance === 0) return 0;
            let score = 0;
            if (summary.revenue > 0) {
              const margin = summary.grossProfit / summary.revenue;
              if (margin > 0.4) score += 40;
              else if (margin > 0.2) score += 30;
              else if (margin > 0) score += 20;

              const expenseRatio = summary.totalExpenses / summary.revenue;
              if (expenseRatio < 0.6) score += 30;
              else if (expenseRatio < 0.9) score += 20;
              else if (expenseRatio < 1.0) score += 10;
            } else {
              if (summary.cashBalance > 0) score += 30;
            }

            if (summary.cashBalance > 0) {
              score += 20;
            }
            if (auditCompliance >= 90) {
              score += 10;
            }
            return score;
          })();

    const employeeCount = currentGrowth.employeeCount || 0;
    const costPerEmployee =
      employeeCount > 0
        ? parseFloat((summary.totalExpenses / employeeCount).toFixed(2))
        : 0;

    const prevRevenue = previousDashboard.revenue || 0;
    const prevGrossProfit = previousDashboard.grossProfit || 0;
    const prevCostOfRevenue = prevRevenue - prevGrossProfit;
    const prevCostOfRevenuePercent =
      prevRevenue > 0
        ? parseFloat(((prevCostOfRevenue / prevRevenue) * 100).toFixed(2))
        : 0;

    const previousFleet = fleetData[1] || ({} as any);
    const prevTotalDeliveries = previousFleet.totalDeliveries || 0;
    const prevTotalVehicles = previousFleet.totalVehicles || 0;
    const prevDeliveriesPerVehicle =
      prevTotalVehicles > 0
        ? parseFloat((prevTotalDeliveries / prevTotalVehicles).toFixed(2))
        : 0;
    const prevFleetUtilization = previousFleet.fleetUtilizationPercent || 0;
    const prevDriverEfficiency = previousFleet.driverEfficiencyOverall || 0;

    const prevTotalExpenses = previousDashboard.totalExpenses || 0;
    const prevCashRunway =
      prevTotalExpenses > 0
        ? parseFloat(
            ((previousDashboard.cashBalance || 0) / prevTotalExpenses).toFixed(
              2,
            ),
          )
        : 0;
    const prevGrowthPercent = previousDashboard.growthPercent || 0;
    const prevEbitda = previousDashboard.ebitda || 0;
    const prevOperatingCashFlow = previousDashboard.netCashFlow || 0;

    const previousGrowth = growthData[1] || ({} as any);
    const prevClientCount = previousGrowth.clientCount || 0;
    const prevCostPerClient =
      prevClientCount > 0
        ? parseFloat(
            ((previousDashboard.totalExpenses || 0) / prevClientCount).toFixed(
              2,
            ),
          )
        : 0;

    const prevEmployeeCount = previousGrowth.employeeCount || 0;
    const prevCostPerEmployee =
      prevEmployeeCount > 0
        ? parseFloat(
            (
              (previousDashboard.totalExpenses || 0) / prevEmployeeCount
            ).toFixed(2),
          )
        : 0;

    const prevOperatingExpenseRatio =
      prevRevenue > 0
        ? parseFloat(
            ((previousDashboard.totalExpenses || 0) / prevRevenue).toFixed(2),
          )
        : 0;
    const prevVariableCost = prevCostOfRevenue > 0 ? prevCostOfRevenue : 0;
    const prevFixedCost =
      (previousDashboard.totalExpenses || 0) - prevVariableCost > 0
        ? (previousDashboard.totalExpenses || 0) - prevVariableCost
        : 0;

    const getTrend = (curr: number, prev: number) => {
      if (prev === 0 && curr > 0) return "+100%";
      if (prev === 0 && curr === 0) return "Stable";
      const diff = curr - prev;
      const pct = (diff / prev) * 100;
      if (Math.abs(pct) < 0.1) return "Stable";
      return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    };

    const variableCost = costOfRevenue > 0 ? costOfRevenue : 0;
    const fixedCost =
      summary.totalExpenses - variableCost > 0
        ? summary.totalExpenses - variableCost
        : 0;

    const rawInsights = currentGrowth.insights || [];

    const resolvedMonth =
      currentDashboard.month || month || new Date().getMonth() + 1;
    const resolvedYear =
      currentDashboard.year || year || new Date().getFullYear();

    const collection = this.dashboardModel.db.collection(
      `company_${companyId}`,
    );
    const activeReports = await collection
      .find({
        collectionType: "report",
        deletedAt: null,
        month: resolvedMonth,
        year: resolvedYear,
      })
      .toArray();

    const aiInsightsList = activeReports.flatMap((report: any) => {
      const insights = report.aiInsights || [];
      if (insights.length === 0) {
        return [
          {
            title:
              report.reportName || report.reportType || "Uploaded Document",
            description: "Report data has been successfully processed.",
          },
        ];
      }
      return insights.map((ins: any) => ({
        title:
          ins.title ||
          report.reportName ||
          report.reportType ||
          "Uploaded Document",
        description: ins.description,
      }));
    });

    const cfoInsights = rawInsights.map((ins: any) => ({
      title: ins.title,
      description: ins.description,
    }));

    const growthTrendValues = dashboardData
      .map((d: any) => d.growthPercent || 0)
      .filter((g: number) => g > 0);
    const avgGrowth =
      growthTrendValues.length > 0
        ? growthTrendValues.reduce((sum: number, val: number) => sum + val, 0) /
          growthTrendValues.length
        : 0;
    const targetValue =
      avgGrowth > 0 ? parseFloat((avgGrowth * 1.25).toFixed(1)) : 5.0;

    const percentageAchieved =
      targetValue > 0 ? Math.round((growthPercent / targetValue) * 100) : 0;

    const forecastVsReality = {
      percentageAchieved: Math.min(percentageAchieved, 100),
      currentValue: growthPercent,
      targetValue: targetValue,
    };

    return {
      summaryCards: {
        totalDeliveries: {
          value: fleetSummary.totalDeliveries,
          trend: getTrend(fleetSummary.totalDeliveries, prevTotalDeliveries),
        },
        deliveriesPerVehicle: {
          value:
            fleetSummary.totalVehicles > 0
              ? parseFloat(
                  (
                    fleetSummary.totalDeliveries / fleetSummary.totalVehicles
                  ).toFixed(2),
                )
              : 0,
          trend: getTrend(
            fleetSummary.totalVehicles > 0
              ? fleetSummary.totalDeliveries / fleetSummary.totalVehicles
              : 0,
            prevDeliveriesPerVehicle,
          ),
        },
        fleetUtilization: {
          value: fleetSummary.fleetUtilization,
          trend: getTrend(fleetSummary.fleetUtilization, prevFleetUtilization),
        },
        driverEfficiency: {
          value: driverEfficiencyOverall,
          trend: getTrend(driverEfficiencyOverall, prevDriverEfficiency),
        },
        cashRunway: {
          value: cashRunway,
          trend: getTrend(cashRunway, prevCashRunway),
        },
        growthPercent: {
          value: growthPercent,
          trend: getTrend(growthPercent, prevGrowthPercent),
        },
        ebitda: {
          value: summary.ebitda,
          trend: getTrend(summary.ebitda, prevEbitda),
        },
        operatingCashFlow: {
          value: summary.operatingCashFlow,
          trend: getTrend(summary.operatingCashFlow, prevOperatingCashFlow),
        },
      },
      revenueTrend: dashboardData.reverse().map((curr) => {
        const dateObj =
          curr.year && curr.month
            ? new Date(curr.year, curr.month - 1, 1)
            : new Date();
        return {
          month: dateObj.toLocaleString("default", { month: "short" }),
          date: dateObj,
          revenue: curr.revenue || 0,
          profit: curr.netProfit || 0,
        };
      }),
      healthMeter: {
        score: financialHealthScore,
        equityHealth: equityHealth,
        auditCompliance: auditCompliance,
      },
      costEfficiency: {
        totalExpenses: {
          value: summary.totalExpenses,
          trend: getTrend(summary.totalExpenses, prevTotalExpenses),
        },
        costOfRevenue: {
          value: costOfRevenuePercent > 0 ? costOfRevenuePercent : 0,
          trend: getTrend(costOfRevenuePercent, prevCostOfRevenuePercent),
        },
        costPerClient: {
          value: costPerClient,
          trend: getTrend(costPerClient, prevCostPerClient),
        },
        operatingExpenseRatio: {
          value:
            summary.revenue > 0
              ? parseFloat((summary.totalExpenses / summary.revenue).toFixed(2))
              : 0,
          trend: getTrend(
            summary.revenue > 0 ? summary.totalExpenses / summary.revenue : 0,
            prevOperatingExpenseRatio,
          ),
        },
        fixedCost: {
          value: fixedCost,
          trend: getTrend(fixedCost, prevFixedCost),
        },
        variableCost: {
          value: variableCost,
          trend: getTrend(variableCost, prevVariableCost),
        },
        costPerEmployee: {
          value: costPerEmployee,
          trend: getTrend(costPerEmployee, prevCostPerEmployee),
        },
      },
      aiInsights: aiInsightsList,
      cfoInsights: cfoInsights,
      forecastVsReality: forecastVsReality,
    };
  }

  // || ---------------------- Export Cost Efficiency CSV ---------------------|| //
  async exportCostEfficiencyCsv(
    company: any,
    queryDto: GetDashboardDto,
  ): Promise<string> {
    if (!company) {
      return "Metric,Value,Trend (vs Prior)\n";
    }
    const dashboardData = await this.getDashboard(company, queryDto);

    // We only need the cost efficiency data, but let's safely fall back
    const costEfficiency = (dashboardData as any).costEfficiency;
    if (!costEfficiency) {
      throw new Error(
        "Cost Efficiency data is not available for this industry yet.",
      );
    }

    const {
      totalExpenses,
      costOfRevenue,
      costPerClient,
      operatingExpenseRatio,
      fixedCost,
      variableCost,
      costPerEmployee,
    } = costEfficiency;

    // Format Values
    const formatCurrency = (val: any) =>
      val !== undefined && val !== null ? `$${val.toLocaleString()}` : "N/A";
    const formatPercent = (val: any) =>
      val !== undefined && val !== null ? `${val}%` : "N/A";
    const formatTrend = (trend: any) => (trend ? trend : "N/A");

    const formatIndustry = (industryStr: string) => {
      if (!industryStr) return "N/A";
      return industryStr
        .replace(/[-_]/g, " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    };

    // Define CSV Structure with nice headers
    let csv = `\n`;
    csv += `"**************************************************"\n`;
    csv += `"              AI-CFO DASHBOARD                  "\n`;
    csv += `"           COST & EFFICIENCY REPORT               "\n`;
    csv += `"**************************************************"\n`;
    csv += `\n`;
    csv += `Workspace:,${company.name || "N/A"}\n`;
    csv += `Industry:,${formatIndustry(company.industry)}\n`;
    csv += `Generated On:,${new Date().toLocaleString()}\n`;
    csv += `\n`; // Empty line
    csv += `--------------------------------------------------\n`;
    csv += `\n`; // Empty line

    // Main Table Headers
    csv += `Metric,Value,Trend (vs Prior)\n`;

    // Append rows
    csv += `Total Expenses,"${formatCurrency(totalExpenses?.value)}","${formatTrend(totalExpenses?.trend)}"\n`;
    csv += `Cost % of Revenue,"${formatPercent(costOfRevenue?.value)}","${formatTrend(costOfRevenue?.trend)}"\n`;
    csv += `Fixed Cost,"${formatCurrency(fixedCost?.value)}","${formatTrend(fixedCost?.trend)}"\n`;
    csv += `Variable Cost,"${formatCurrency(variableCost?.value)}","${formatTrend(variableCost?.trend)}"\n`;
    csv += `Cost per Client,"${formatCurrency(costPerClient?.value)}","${formatTrend(costPerClient?.trend)}"\n`;
    csv += `Cost per Employee,"${formatCurrency(costPerEmployee?.value)}","${formatTrend(costPerEmployee?.trend)}"\n`;
    csv += `Operating Expense Ratio,"${formatPercent(operatingExpenseRatio?.value)}","${formatTrend(operatingExpenseRatio?.trend)}"\n`;

    return csv;
  }
}
