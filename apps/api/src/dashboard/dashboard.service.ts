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
    const { month, year, period, quarter } = queryDto;

    const financialYearType = company.financialYearType || "apr_to_mar";

    return this.getFleetDashboard(companyId, month, year, period, quarter, financialYearType);
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
      forecastVsReality: {
        percentageAchieved: 0,
        currentValue: 0,
        targetValue: 0,
      },
    };
  }

  // || ---------------------- Get Fleet Dashboard Data function ---------------------|| //
  private async getFleetDashboard(
    companyId: string,
    month?: number,
    year?: number,
    period?: DashboardPeriodEnum,
    quarter?: number,
    financialYearType: string = "apr_to_mar"
  ) {
    // 1. Fetch all documents for the company from MongoDB
    const [allDashboardData, allFleetData, allGrowthData] = await Promise.all([
      this.dashboardModel
        .find({ companyId })
        .sort({ year: -1, month: -1 })
        .exec(),
      this.fleetModel.find({ companyId }).sort({ year: -1, month: -1 }).exec(),
      this.growthModel.find({ companyId }).sort({ year: -1, month: -1 }).exec(),
    ]);

    const targetYear =
      year || (allDashboardData[0]?.year as number) || new Date().getFullYear();
    const targetMonth =
      month ||
      (allDashboardData[0]?.month as number) ||
      new Date().getMonth() + 1;

    let currentPeriodMonths: { year: number; month: number }[] = [];
    let prevPeriodMonths: { year: number; month: number }[] = [];
    let monthsInPeriod = 1;

    if (period === DashboardPeriodEnum.YEARLY) {
      monthsInPeriod = 12;
      if (financialYearType === "jan_to_dec") {
        currentPeriodMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({ year: targetYear, month: m }));
        prevPeriodMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({ year: targetYear - 1, month: m }));
      } else {
        currentPeriodMonths = [
          ...[4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({ year: targetYear, month: m })),
          ...[1, 2, 3].map((m) => ({ year: targetYear + 1, month: m })),
        ];
        prevPeriodMonths = [
          ...[4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({ year: targetYear - 1, month: m })),
          ...[1, 2, 3].map((m) => ({ year: targetYear, month: m })),
        ];
      }
    } else if (period === DashboardPeriodEnum.QUARTERLY) {
      monthsInPeriod = 3;
      let currentMonth = new Date().getMonth() + 1;
      let defaultQ = 1;
      
      if (financialYearType === "jan_to_dec") {
        if (currentMonth >= 1 && currentMonth <= 3) defaultQ = 1;
        else if (currentMonth >= 4 && currentMonth <= 6) defaultQ = 2;
        else if (currentMonth >= 7 && currentMonth <= 9) defaultQ = 3;
        else defaultQ = 4;
      } else {
        if (currentMonth >= 4 && currentMonth <= 6) defaultQ = 1;
        else if (currentMonth >= 7 && currentMonth <= 9) defaultQ = 2;
        else if (currentMonth >= 10 && currentMonth <= 12) defaultQ = 3;
        else defaultQ = 4;
      }
      
      const q = quarter || defaultQ;

      const getQuarterMonths = (qNum: number, baseYear: number) => {
        if (financialYearType === "jan_to_dec") {
          if (qNum === 1) return [1, 2, 3].map((m) => ({ year: baseYear, month: m }));
          if (qNum === 2) return [4, 5, 6].map((m) => ({ year: baseYear, month: m }));
          if (qNum === 3) return [7, 8, 9].map((m) => ({ year: baseYear, month: m }));
          if (qNum === 4) return [10, 11, 12].map((m) => ({ year: baseYear, month: m }));
        } else {
          if (qNum === 1) return [4, 5, 6].map((m) => ({ year: baseYear, month: m }));
          if (qNum === 2) return [7, 8, 9].map((m) => ({ year: baseYear, month: m }));
          if (qNum === 3) return [10, 11, 12].map((m) => ({ year: baseYear, month: m }));
          if (qNum === 4) return [1, 2, 3].map((m) => ({ year: baseYear + 1, month: m }));
        }
        return [];
      };

      currentPeriodMonths = getQuarterMonths(q, targetYear);

      if (q === 1) {
        prevPeriodMonths = getQuarterMonths(4, targetYear - 1);
      } else {
        prevPeriodMonths = getQuarterMonths(q - 1, targetYear);
      }
    } else {
      // Monthly (default)
      monthsInPeriod = 1;
      let actualYear = targetYear;
      if (financialYearType === "apr_to_mar" && targetMonth <= 3) {
        actualYear = targetYear + 1;
      }
      currentPeriodMonths = [{ year: actualYear, month: targetMonth }];

      if (targetMonth === 1) {
        prevPeriodMonths = [{ year: actualYear - 1, month: 12 }];
      } else if (financialYearType === "apr_to_mar" && targetMonth === 4) {
        prevPeriodMonths = [{ year: actualYear - 1, month: 3 }];
      } else {
        prevPeriodMonths = [{ year: actualYear, month: targetMonth - 1 }];
      }
    }

    const isDocInPeriod = (
      d: any,
      periodMonths: { year: number; month: number }[],
    ) => {
      if (d.year == null || d.month == null) return false;
      return periodMonths.some((pm) => pm.year === d.year && pm.month === d.month);
    };

    // Filter current and previous periods from all fetched documents
    const currentDashboardDocs = allDashboardData.filter((d) =>
      isDocInPeriod(d, currentPeriodMonths),
    );
    const previousDashboardDocs = allDashboardData.filter((d) =>
      isDocInPeriod(d, prevPeriodMonths),
    );

    const currentFleetDocs = allFleetData.filter((d) =>
      isDocInPeriod(d, currentPeriodMonths),
    );
    const previousFleetDocs = allFleetData.filter((d) =>
      isDocInPeriod(d, prevPeriodMonths),
    );

    const currentGrowthDocs = allGrowthData.filter((d) =>
      isDocInPeriod(d, currentPeriodMonths),
    );
    const previousGrowthDocs = allGrowthData.filter((d) =>
      isDocInPeriod(d, prevPeriodMonths),
    );

    const round2 = (val: number | null | undefined) =>
      val != null ? parseFloat(Number(val).toFixed(2)) : 0;

    // Inline Aggregation Logic
    let currentDashboard: any = {};
    let previousDashboard: any = {};
    let currentFleet: any = {};
    let prevFleet: any = {};
    let currentGrowth: any = {};
    let previousGrowth: any = {};

    if (
      period === DashboardPeriodEnum.QUARTERLY ||
      period === DashboardPeriodEnum.YEARLY
    ) {
      // 1. Dashboard summary aggregation
      if (currentDashboardDocs.length > 0) {
        let revenue = 0,
          grossProfit = 0,
          netProfit = 0,
          ebitda = 0,
          totalExpenses = 0,
          netCashFlow = 0;
        let healthScoreSum = 0,
          growthSum = 0,
          equitySum = 0,
          complianceSum = 0;

        for (const doc of currentDashboardDocs) {
          revenue += doc.revenue || 0;
          grossProfit += doc.grossProfit || 0;
          netProfit += doc.netProfit || 0;
          ebitda += doc.ebitda || 0;
          totalExpenses += doc.totalExpenses || 0;
          netCashFlow += doc.netCashFlow || 0;
          healthScoreSum += doc.financialHealthScore || 0;
          growthSum += doc.growthPercent || 0;
          equitySum += doc.equityHealth || 0;
          complianceSum += doc.auditCompliance || 0;
        }

        const sorted = [...currentDashboardDocs].sort(
          (a, b) => (a.month || 0) - (b.month || 0),
        );
        const cashBalance = sorted[sorted.length - 1]?.cashBalance || 0;

        currentDashboard = {
          revenue,
          grossProfit,
          netProfit,
          ebitda,
          totalExpenses,
          netCashFlow,
          cashBalance,
          financialHealthScore: round2(
            healthScoreSum / currentDashboardDocs.length,
          ),
          growthPercent: round2(growthSum / currentDashboardDocs.length),
          equityHealth: round2(equitySum / currentDashboardDocs.length),
          auditCompliance: round2(complianceSum / currentDashboardDocs.length),
        };
      }

      if (previousDashboardDocs.length > 0) {
        let revenue = 0,
          grossProfit = 0,
          netProfit = 0,
          ebitda = 0,
          totalExpenses = 0,
          netCashFlow = 0;
        let healthScoreSum = 0,
          growthSum = 0,
          equitySum = 0,
          complianceSum = 0;

        for (const doc of previousDashboardDocs) {
          revenue += doc.revenue || 0;
          grossProfit += doc.grossProfit || 0;
          netProfit += doc.netProfit || 0;
          ebitda += doc.ebitda || 0;
          totalExpenses += doc.totalExpenses || 0;
          netCashFlow += doc.netCashFlow || 0;
          healthScoreSum += doc.financialHealthScore || 0;
          growthSum += doc.growthPercent || 0;
          equitySum += doc.equityHealth || 0;
          complianceSum += doc.auditCompliance || 0;
        }

        const sorted = [...previousDashboardDocs].sort(
          (a, b) => (a.month || 0) - (b.month || 0),
        );
        const cashBalance = sorted[sorted.length - 1]?.cashBalance || 0;

        previousDashboard = {
          revenue,
          grossProfit,
          netProfit,
          ebitda,
          totalExpenses,
          netCashFlow,
          cashBalance,
          financialHealthScore: round2(
            healthScoreSum / previousDashboardDocs.length,
          ),
          growthPercent: round2(growthSum / previousDashboardDocs.length),
          equityHealth: round2(equitySum / previousDashboardDocs.length),
          auditCompliance: round2(complianceSum / previousDashboardDocs.length),
        };
      }

      // 2. Fleet analytics aggregation
      if (currentFleetDocs.length > 0) {
        let totalDeliveries = 0,
          fleetUtil = 0,
          totalVehicles = 0,
          activeVehicles = 0,
          inactiveVehicles = 0;
        let totalTrips = 0,
          completedTrips = 0,
          cancelledTrips = 0,
          driverEff = 0;

        for (const doc of currentFleetDocs) {
          totalDeliveries += doc.totalDeliveries || 0;
          fleetUtil += doc.fleetUtilizationPercent || 0;
          totalVehicles += doc.totalVehicles || 0;
          activeVehicles += doc.activeVehicles || 0;
          inactiveVehicles += doc.inactiveVehicles || 0;
          totalTrips += doc.totalTrips || 0;
          completedTrips += doc.completedTrips || 0;
          cancelledTrips += doc.cancelledTrips || 0;
          driverEff += doc.driverEfficiencyOverall || 0;
        }

        currentFleet = {
          totalDeliveries,
          fleetUtilizationPercent: round2(fleetUtil / currentFleetDocs.length),
          totalVehicles: round2(totalVehicles / currentFleetDocs.length),
          activeVehicles: round2(activeVehicles / currentFleetDocs.length),
          inactiveVehicles: round2(inactiveVehicles / currentFleetDocs.length),
          totalTrips,
          completedTrips,
          cancelledTrips,
          driverEfficiencyOverall: round2(driverEff / currentFleetDocs.length),
        };
      }

      if (previousFleetDocs.length > 0) {
        let totalDeliveries = 0,
          fleetUtil = 0,
          totalVehicles = 0,
          activeVehicles = 0,
          inactiveVehicles = 0;
        let totalTrips = 0,
          completedTrips = 0,
          cancelledTrips = 0,
          driverEff = 0;

        for (const doc of previousFleetDocs) {
          totalDeliveries += doc.totalDeliveries || 0;
          fleetUtil += doc.fleetUtilizationPercent || 0;
          totalVehicles += doc.totalVehicles || 0;
          activeVehicles += doc.activeVehicles || 0;
          inactiveVehicles += doc.inactiveVehicles || 0;
          totalTrips += doc.totalTrips || 0;
          completedTrips += doc.completedTrips || 0;
          cancelledTrips += doc.cancelledTrips || 0;
          driverEff += doc.driverEfficiencyOverall || 0;
        }

        prevFleet = {
          totalDeliveries,
          fleetUtilizationPercent: round2(fleetUtil / previousFleetDocs.length),
          totalVehicles: round2(totalVehicles / previousFleetDocs.length),
          activeVehicles: round2(activeVehicles / previousFleetDocs.length),
          inactiveVehicles: round2(inactiveVehicles / previousFleetDocs.length),
          totalTrips,
          completedTrips,
          cancelledTrips,
          driverEfficiencyOverall: round2(driverEff / previousFleetDocs.length),
        };
      }

      // 3. Growth analytics aggregation
      if (currentGrowthDocs.length > 0) {
        let clientCount = 0,
          employeeCount = 0;
        const insights: any[] = [];
        const seen = new Set();

        for (const doc of currentGrowthDocs) {
          clientCount += doc.clientCount || 0;
          employeeCount += doc.employeeCount || 0;
          if (doc.insights && Array.isArray(doc.insights)) {
            for (const ins of doc.insights) {
              if (ins.title && !seen.has(ins.title)) {
                seen.add(ins.title);
                insights.push(ins);
              }
            }
          }
        }

        currentGrowth = {
          clientCount: round2(clientCount / currentGrowthDocs.length),
          employeeCount: round2(employeeCount / currentGrowthDocs.length),
          insights,
        };
      }

      if (previousGrowthDocs.length > 0) {
        let clientCount = 0,
          employeeCount = 0;
        const insights: any[] = [];
        const seen = new Set();

        for (const doc of previousGrowthDocs) {
          clientCount += doc.clientCount || 0;
          employeeCount += doc.employeeCount || 0;
          if (doc.insights && Array.isArray(doc.insights)) {
            for (const ins of doc.insights) {
              if (ins.title && !seen.has(ins.title)) {
                seen.add(ins.title);
                insights.push(ins);
              }
            }
          }
        }

        previousGrowth = {
          clientCount: round2(clientCount / previousGrowthDocs.length),
          employeeCount: round2(employeeCount / previousGrowthDocs.length),
          insights,
        };
      }
    } else {
      // Monthly (standard match)
      currentDashboard =
        allDashboardData.find(
          (d) => d.year === targetYear && d.month === targetMonth,
        ) || ({} as any);
      previousDashboard =
        allDashboardData.find(
          (d) =>
            d.year === (prevPeriodMonths[0]?.year || targetYear) &&
            d.month === (prevPeriodMonths[0]?.month || targetMonth),
        ) || ({} as any);

      currentFleet =
        allFleetData.find(
          (d) => d.year === targetYear && d.month === targetMonth,
        ) || ({} as any);
      prevFleet = allFleetData[1] || ({} as any);

      currentGrowth =
        allGrowthData.find(
          (d) => d.year === targetYear && d.month === targetMonth,
        ) || ({} as any);
      previousGrowth = allGrowthData[1] || ({} as any);
    }

    const summary = {
      revenue: currentDashboard.revenue || 0,
      grossProfit: currentDashboard.grossProfit || 0,
      ebitda: currentDashboard.ebitda || 0,
      totalExpenses: currentDashboard.totalExpenses || 0,
      operatingCashFlow: currentDashboard.netCashFlow || 0,
      cashBalance: currentDashboard.cashBalance || 0,
      financialHealthScore: currentDashboard.financialHealthScore || 0,
    };

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

    const clientCount = currentGrowth.clientCount || 0;

    // Derived Calculations
    const cashRunway =
      summary.totalExpenses > 0
        ? parseFloat(
            (
              summary.cashBalance /
              (summary.totalExpenses / monthsInPeriod)
            ).toFixed(2),
          )
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
            if (
              summary.revenue === 0 &&
              summary.totalExpenses === 0 &&
              summary.cashBalance === 0
            )
              return 0;
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

    const prevTotalDeliveries = prevFleet.totalDeliveries || 0;
    const prevTotalVehicles = prevFleet.totalVehicles || 0;
    const prevDeliveriesPerVehicle =
      prevTotalVehicles > 0
        ? parseFloat((prevTotalDeliveries / prevTotalVehicles).toFixed(2))
        : 0;
    const prevFleetUtilization = prevFleet.fleetUtilizationPercent || 0;
    const prevDriverEfficiency = prevFleet.driverEfficiencyOverall || 0;

    const prevTotalExpenses = previousDashboard.totalExpenses || 0;
    const prevCashRunway =
      prevTotalExpenses > 0
        ? parseFloat(
            (
              (previousDashboard.cashBalance || 0) /
              (prevTotalExpenses / monthsInPeriod)
            ).toFixed(2),
          )
        : 0;
    const prevGrowthPercent = previousDashboard.growthPercent || 0;
    const prevEbitda = previousDashboard.ebitda || 0;
    const prevOperatingCashFlow = previousDashboard.netCashFlow || 0;

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

    const reportsQuery: any = {
      collectionType: "report",
      deletedAt: null,
      $or: currentPeriodMonths.map((pm) => ({ year: pm.year, month: pm.month })),
    };

    const activeReports = await collection.find(reportsQuery).toArray();

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

    // Historical Trend Data Logic
    let trendData: any[] = [];
    if (period === DashboardPeriodEnum.YEARLY) {
      const yearlyGroups: Record<number, { revenue: number; profit: number }> =
        {};
      for (const doc of allDashboardData) {
        if (doc.year) {
          if (!yearlyGroups[doc.year]) {
            yearlyGroups[doc.year] = { revenue: 0, profit: 0 };
          }
          yearlyGroups[doc.year].revenue += doc.revenue || 0;
          yearlyGroups[doc.year].profit += doc.netProfit || 0;
        }
      }
      const sortedYears = Object.keys(yearlyGroups)
        .map(Number)
        .sort((a, b) => a - b);
      trendData = sortedYears.map((yr) => ({
        name: String(yr),
        date: new Date(yr, 0, 1),
        revenue: yearlyGroups[yr].revenue,
        profit: yearlyGroups[yr].profit,
      }));
    } else if (period === DashboardPeriodEnum.QUARTERLY) {
      const quarterGroups: Record<
        string,
        { year: number; quarter: number; revenue: number; profit: number }
      > = {};
      for (const doc of allDashboardData) {
        if (doc.year && doc.month) {
          const q = Math.ceil(doc.month / 3);
          const key = `${doc.year}-Q${q}`;
          if (!quarterGroups[key]) {
            quarterGroups[key] = {
              year: doc.year,
              quarter: q,
              revenue: 0,
              profit: 0,
            };
          }
          quarterGroups[key].revenue += doc.revenue || 0;
          quarterGroups[key].profit += doc.netProfit || 0;
        }
      }
      const sortedKeys = Object.keys(quarterGroups).sort((a, b) => {
        const [aYear, aQ] = a.split("-Q").map(Number);
        const [bYear, bQ] = b.split("-Q").map(Number);
        if (aYear !== bYear) return aYear - bYear;
        return aQ - bQ;
      });
      const lastKeys = sortedKeys.slice(-6);
      trendData = lastKeys.map((key) => {
        const item = quarterGroups[key];
        const dateObj = new Date(item.year, (item.quarter - 1) * 3, 1);
        return {
          name: `${item.year} Q${item.quarter}`,
          date: dateObj,
          revenue: item.revenue,
          profit: item.profit,
        };
      });
    } else {
      const filteredMonthlyDocs = allDashboardData.filter(
        (d) =>
          d.year !== null &&
          d.year !== undefined &&
          d.month !== null &&
          d.month !== undefined &&
          (d.year < targetYear ||
            (d.year === targetYear && d.month <= targetMonth)),
      );
      const sortedMonthlyDocs = [...filteredMonthlyDocs].sort((a, b) => {
        if (a.year !== b.year) return a.year! - b.year!;
        return a.month! - b.month!;
      });
      const last12Docs = sortedMonthlyDocs.slice(-12);
      trendData = last12Docs.map((curr) => {
        const dateObj = new Date(curr.year!, curr.month! - 1, 1);
        return {
          name: dateObj.toLocaleString("default", { month: "short" }),
          date: dateObj,
          revenue: curr.revenue || 0,
          profit: curr.netProfit || 0,
        };
      });
    }

    const growthTrendValues = allDashboardData
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
      revenueTrend: trendData,
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

  // || ---------------------- Export Entire Dashboard CSV ---------------------|| //
  async exportDashboardCsv(
    company: any,
    queryDto: GetDashboardDto,
  ): Promise<string> {
    if (!company) {
      return "Metric,Value,Trend (vs Prior)\n";
    }
    const dashboardData = await this.getDashboard(company, queryDto);

    const {
      summaryCards = {},
      costEfficiency = {},
      healthMeter = {},
      revenueTrend = [],
      aiInsights = [],
    } = dashboardData as any;

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

    let csv = `\n`;
    csv += `"**************************************************"\n`;
    csv += `"              AI-CFO DASHBOARD REPORT             "\n`;
    csv += `"               COMPLETE FINANCIAL EXPORT          "\n`;
    csv += `"**************************************************"\n`;
    csv += `\n`;
    csv += `Workspace:,${company.name || "N/A"}\n`;
    csv += `Industry:,${formatIndustry(company.industry)}\n`;
    csv += `Period:,${queryDto.month ? `${queryDto.month}/${queryDto.year}` : "Latest"}\n`;
    csv += `Generated On:,${new Date().toLocaleString()}\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 1: KPI SUMMARY CARDS
    csv += `"SECTION 1: KEY PERFORMANCE INDICATORS"\n`;
    csv += `Metric,Value,Trend (vs Prior)\n`;
    for (const [key, card] of Object.entries(summaryCards) as any) {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str: any) => str.toUpperCase());
      const value =
        card.value !== undefined && card.value !== null ? card.value : "N/A";
      let formattedVal = String(value);
      if (typeof value === "number") {
        if (key === "ebitda" || key === "operatingCashFlow") {
          formattedVal = formatCurrency(value);
        } else if (
          key === "growthPercent" ||
          key === "fleetUtilization" ||
          key === "driverEfficiency" ||
          key === "deliveriesPerVehicle"
        ) {
          formattedVal = String(value);
        }
      }
      csv += `"${label}","${formattedVal}","${formatTrend(card.trend)}"\n`;
    }
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 2: COST & EFFICIENCY METRICS
    csv += `"SECTION 2: COST & EFFICIENCY METRICS"\n`;
    csv += `Metric,Value,Trend (vs Prior)\n`;
    for (const [key, card] of Object.entries(costEfficiency) as any) {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str: any) => str.toUpperCase());
      const value =
        card.value !== undefined && card.value !== null ? card.value : "N/A";
      let formattedVal = String(value);
      if (typeof value === "number") {
        if (
          key === "totalExpenses" ||
          key === "fixedCost" ||
          key === "variableCost" ||
          key === "costPerClient" ||
          key === "costPerEmployee"
        ) {
          formattedVal = formatCurrency(value);
        } else if (key === "costOfRevenue" || key === "operatingExpenseRatio") {
          formattedVal = formatPercent(value);
        }
      }
      csv += `"${label}","${formattedVal}","${formatTrend(card.trend)}"\n`;
    }
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 3: HEALTH METER
    csv += `"SECTION 3: FINANCIAL HEALTH SCORES"\n`;
    csv += `Metric,Score\n`;
    csv += `Financial Health Score,"${healthMeter.score || 0}/100"\n`;
    csv += `Equity Health Score,"${healthMeter.equityHealth || 0}%"\n`;
    csv += `Audit Compliance Score,"${healthMeter.auditCompliance || 0}%"\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 4: REVENUE & PROFIT TRENDS
    csv += `"SECTION 4: REVENUE & PROFIT TRENDS (12 MONTHS)"\n`;
    csv += `Month,Revenue,Net Profit\n`;
    for (const item of revenueTrend) {
      csv += `"${item.month}","${formatCurrency(item.revenue)}","${formatCurrency(item.profit)}"\n`;
    }
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 5: AI INSIGHTS
    csv += `"SECTION 5: AI-GENERATED FINANCIAL INSIGHTS"\n`;
    csv += `Title,Insight Description\n`;
    for (const insight of aiInsights) {
      csv += `"${insight.title || "Insight"}","${insight.description || ""}"\n`;
    }

    return csv;
  }
}
