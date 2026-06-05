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
    const { period } = queryDto;
    const companyId = company._id.toString();

    const typeQuery = {
      companyId,
      periodType: period.toLowerCase(),
    };

    if (company.industry === IndustryEnum.FLEET_MANAGEMENT) {
      return this.getFleetDashboard(companyId, typeQuery);
    }

    return {
      message: `Dashboard for industry ${company.industry} is not implemented yet.`,
    };
  }

  // || ---------------------- Get Fleet Dashboard Data function ---------------------|| //
  private async getFleetDashboard(companyId: string, typeQuery: any) {
    // Inject Growth model locally for this function since we need client count
    const [dashboardData, fleetData, growthData] = await Promise.all([
      this.dashboardModel.find(typeQuery).sort({ periodStartDate: -1 }).limit(12).exec(),
      this.fleetModel.find(typeQuery).sort({ periodStartDate: -1 }).limit(1).exec(),
      this.growthModel.find(typeQuery).sort({ periodStartDate: -1 }).limit(2).exec(),
    ]);

    const currentDashboard = dashboardData[0] || {} as any;
    const previousDashboard = dashboardData[1] || {} as any;
    
    const summary = {
      revenue: currentDashboard.revenue || 0,
      grossProfit: currentDashboard.grossProfit || 0,
      ebitda: currentDashboard.ebitda || 0,
      totalExpenses: currentDashboard.totalExpenses || 0,
      operatingCashFlow: currentDashboard.netCashFlow || 0,
      cashBalance: currentDashboard.cashBalance || 0,
      financialHealthScore: currentDashboard.financialHealthScore || 0,
    };

    const currentFleet = fleetData[0] || {} as any;
    
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

    const currentGrowth = growthData[0] || {};
    const clientCount = currentGrowth.clientCount || 0;

    // Derived Calculations
    const cashRunway = summary.totalExpenses > 0 ? parseFloat((summary.cashBalance / summary.totalExpenses).toFixed(2)) : 0;
    
    let growthPercent = 0;
    if (previousDashboard.revenue && previousDashboard.revenue > 0) {
      growthPercent = parseFloat((((summary.revenue - previousDashboard.revenue) / previousDashboard.revenue) * 100).toFixed(2));
    } else if (summary.revenue > 0) {
      growthPercent = 100; // 100% growth if no previous revenue
    }

    const costOfRevenue = summary.revenue - summary.grossProfit;
    const costPerClient = clientCount > 0 ? parseFloat((summary.totalExpenses / clientCount).toFixed(2)) : 0;
    
    const equityHealth = summary.revenue > summary.totalExpenses ? 85 : 40;
    const auditCompliance = 100; // Keeping 100 as default compliance for now unless we track audits

    const driverEfficiencyOverall = 0; // Deprecated, keeping as 0 to not break frontend structure

    return {
      summaryCards: {
        totalDeliveries: fleetSummary.totalDeliveries,
        deliveriesPerVehicle:
          fleetSummary.totalVehicles > 0
            ? parseFloat(
                (
                  fleetSummary.totalDeliveries / fleetSummary.totalVehicles
                ).toFixed(2),
              )
            : 0,
        fleetUtilization: fleetSummary.fleetUtilization,
        driverEfficiency: driverEfficiencyOverall,
        cashRunway: cashRunway,
        growthPercent: growthPercent,
        ebitda: summary.ebitda,
        operatingCashFlow: summary.operatingCashFlow,
      },
      revenueTrend: dashboardData.reverse().map((curr) => ({
        date: curr.periodStartDate || new Date(),
        revenue: curr.revenue || 0,
      })),
      healthMeter: {
        score: summary.financialHealthScore || 0,
        equityHealth: equityHealth,
        auditCompliance: auditCompliance,
      },
      costEfficiency: {
        totalExpenses: summary.totalExpenses,
        costOfRevenue: costOfRevenue > 0 ? costOfRevenue : 0,
        costPerClient: costPerClient,
        operatingExpenseRatio:
          summary.revenue > 0
            ? parseFloat((summary.totalExpenses / summary.revenue).toFixed(2))
            : 0,
      },
      fleetAnalytics: {
        totalVehicles: fleetSummary.totalVehicles,
        activeVehicles: fleetSummary.activeVehicles,
        inactiveVehicles: fleetSummary.inactiveVehicles,
        totalTrips: fleetSummary.totalTrips,
        completedTrips: fleetSummary.completedTrips,
        cancelledTrips: fleetSummary.cancelledTrips,
      },
    };
  }
}
