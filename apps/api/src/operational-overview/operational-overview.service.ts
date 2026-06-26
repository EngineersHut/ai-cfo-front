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
  GetOperationalOverviewDto,
  OperationalPeriodEnum,
} from "./dto/get-operational-overview.dto";
import { IndustryEnum } from "../common/enums/company.enum";

@Injectable()
export class OperationalOverviewService {
  constructor(
    private companyService: CompanyService,
    @InjectModel(DashboardSummary.name)
    private dashboardModel: Model<DashboardSummaryDocument>,
    @InjectModel(FleetAnalytics.name)
    private fleetModel: Model<FleetAnalyticsDocument>,
  ) {}

  // || ---------------------- Get Operational Overview Data function ---------------------|| //
  async getOperationalOverview(
    company: any,
    queryDto: GetOperationalOverviewDto,
  ) {
    if (!company) {
      return this.getEmptyOverview();
    }
    const companyId = company._id.toString();
    const { month, year } = queryDto;

    return this.getFleetOperationalOverview(companyId, month, year);
  }

  private getEmptyOverview() {
    return {
      summaryCards: {
        totalDeliveriesTrips: { value: 0, trend: "Stable" },
        deliveriesPerVehicle: { value: 0, trend: "Stable" },
        fleetUtilizationPercent: { value: 0, trend: "Stable" },
        driverEfficiency: { value: 0, trend: "Stable" },
      },
      coreOperations: {
        totalDeliveriesTrips: { value: 0, vsPrior: 0, distribution: 0 },
        deliveriesPerVehicle: { value: 0, vsPrior: 0, distribution: 0 },
        onTimeDeliveryPercent: { value: 0, vsPrior: 0, distribution: 0 },
        failedDeliveryPercent: { value: 0, vsPrior: 0, distribution: 0 },
      },
      operationalHealth: {
        healthScore: 0,
        fleetEfficiency: 0,
        deliverySuccessRate: 0,
        costEfficiency: 0,
      },
      costEfficiency: {
        fuelCost: { value: 0, vsPrior: 0, distribution: 0 },
        maintenanceCost: { value: 0, vsPrior: 0, distribution: 0 },
        costPerTrip: { value: 0, vsPrior: 0, distribution: 0 },
        costPerKm: { value: 0, vsPrior: 0, distribution: 0 },
      },
      fleetDriverUtilization: {
        totalVehicles: { value: 0, vsPrior: 0, distribution: 0 },
        activeVehicles: { value: 0, vsPrior: 0, distribution: 0 },
        inactiveVehicles: { value: 0, vsPrior: 0, distribution: 0 },
        fleetUtilizationPercent: { value: 0, vsPrior: 0, distribution: 0 },
      },
      driverPerformance: {
        totalDeliveriesTrips: { value: 0, vsPrior: 0, distribution: 0 },
        deliveriesPerVehicle: { value: 0, vsPrior: 0, distribution: 0 },
        onTimeDeliveryPercent: { value: 0, vsPrior: 0, distribution: 0 },
        failedDeliveryPercent: { value: 0, vsPrior: 0, distribution: 0 },
      },
    };
  }

  // || ---------------------- Get Fleet Operational Overview Data function ---------------------|| //
  private async getFleetOperationalOverview(
    companyId: string,
    month?: number,
    year?: number,
  ) {
    const query: any = { companyId };
    if (year && month) {
      query.year = year;
      query.month = month;
    }

    const [dashboardData, fleetData] = await Promise.all([
      this.dashboardModel
        .find(query)
        .sort({ year: -1, month: -1 })
        .limit(2)
        .exec(),
      this.fleetModel.find(query).sort({ year: -1, month: -1 }).limit(2).exec(),
    ]);

    const currentFleet = fleetData[0] || ({} as any);
    const previousFleet = fleetData[1] || ({} as any);

    const fleetSummary = {
      totalDeliveriesTrips:
        (currentFleet.totalDeliveries || 0) + (currentFleet.totalTrips || 0),
      fleetUtilizationPercent: currentFleet.fleetUtilizationPercent || 0,
      totalVehicles: currentFleet.totalVehicles || 0,
    };

    const previousFleetSummary = {
      totalDeliveriesTrips:
        (previousFleet.totalDeliveries || 0) + (previousFleet.totalTrips || 0),
      totalVehicles: previousFleet.totalVehicles || 0,
    };

    const driverEfficiencyOverall =
      currentFleet.driverEfficiencyOverall !== undefined &&
      currentFleet.driverEfficiencyOverall !== null
        ? currentFleet.driverEfficiencyOverall
        : currentFleet.onTimePercent || 0;

    const deliveriesPerVehicle =
      fleetSummary.totalVehicles > 0
        ? parseFloat(
            (
              fleetSummary.totalDeliveriesTrips / fleetSummary.totalVehicles
            ).toFixed(2),
          )
        : 0;

    const previousDeliveriesPerVehicle =
      previousFleetSummary.totalVehicles > 0
        ? parseFloat(
            (
              previousFleetSummary.totalDeliveriesTrips /
              previousFleetSummary.totalVehicles
            ).toFixed(2),
          )
        : 0;

    const onTimePercent = currentFleet.onTimePercent || 0;
    const previousOnTimePercent = previousFleet.onTimePercent || 0;

    const failedDeliveryPercent =
      onTimePercent > 0 ? parseFloat((100 - onTimePercent).toFixed(2)) : 0;
    const previousFailedDeliveryPercent =
      previousOnTimePercent > 0
        ? parseFloat((100 - previousOnTimePercent).toFixed(2))
        : 0;

    const utilization = fleetSummary.fleetUtilizationPercent;

    // Calculate operational health score based on utilization and on-time percent
    const healthScore =
      utilization > 0 && onTimePercent > 0
        ? parseFloat(((utilization + onTimePercent) / 2).toFixed(2))
        : utilization || onTimePercent || 0;

    const calculateVsPrior = (current: number, previous: number) => {
      if (previous === 0 && current > 0) return 100;
      if (previous === 0 && current === 0) return 0;
      return parseFloat((((current - previous) / previous) * 100).toFixed(2));
    };

    const driverPerformanceBlock = {
      totalDeliveriesTrips: {
        value: fleetSummary.totalDeliveriesTrips,
        vsPrior: calculateVsPrior(
          fleetSummary.totalDeliveriesTrips,
          previousFleetSummary.totalDeliveriesTrips,
        ),
        distribution: 100,
      },
      deliveriesPerVehicle: {
        value: deliveriesPerVehicle,
        vsPrior: calculateVsPrior(
          deliveriesPerVehicle,
          previousDeliveriesPerVehicle,
        ),
        distribution: 100,
      },
      onTimeDeliveryPercent: {
        value: onTimePercent,
        vsPrior: calculateVsPrior(onTimePercent, previousOnTimePercent),
        distribution: onTimePercent,
      },
      failedDeliveryPercent: {
        value: failedDeliveryPercent,
        vsPrior: calculateVsPrior(
          failedDeliveryPercent,
          previousFailedDeliveryPercent,
        ),
        distribution: failedDeliveryPercent,
      },
    };

    const costEfficiencyBlock = {
      fuelCost: {
        value: currentFleet.fuelCost || 0,
        vsPrior: calculateVsPrior(
          currentFleet.fuelCost || 0,
          previousFleet.fuelCost || 0,
        ),
        distribution: 100,
      },
      maintenanceCost: {
        value: currentFleet.maintenanceCost || 0,
        vsPrior: calculateVsPrior(
          currentFleet.maintenanceCost || 0,
          previousFleet.maintenanceCost || 0,
        ),
        distribution: 100,
      },
      costPerTrip: {
        value: currentFleet.costPerTrip || 0,
        vsPrior: calculateVsPrior(
          currentFleet.costPerTrip || 0,
          previousFleet.costPerTrip || 0,
        ),
        distribution: 100,
      },
      costPerKm: {
        value: currentFleet.costPerKm || 0,
        vsPrior: calculateVsPrior(
          currentFleet.costPerKm || 0,
          previousFleet.costPerKm || 0,
        ),
        distribution: 100,
      },
    };

    const activeVehicleDistribution =
      fleetSummary.totalVehicles > 0
        ? parseFloat(
            (
              ((currentFleet.activeVehicles || 0) /
                fleetSummary.totalVehicles) *
              100
            ).toFixed(2),
          )
        : 0;
    const inactiveVehicleDistribution =
      fleetSummary.totalVehicles > 0
        ? parseFloat(
            (
              ((currentFleet.inactiveVehicles || 0) /
                fleetSummary.totalVehicles) *
              100
            ).toFixed(2),
          )
        : 0;

    const fleetDriverUtilizationBlock = {
      totalVehicles: {
        value: currentFleet.totalVehicles || 0,
        vsPrior: calculateVsPrior(
          currentFleet.totalVehicles || 0,
          previousFleet.totalVehicles || 0,
        ),
        distribution: 100,
      },
      activeVehicles: {
        value: currentFleet.activeVehicles || 0,
        vsPrior: calculateVsPrior(
          currentFleet.activeVehicles || 0,
          previousFleet.activeVehicles || 0,
        ),
        distribution: activeVehicleDistribution,
      },
      inactiveVehicles: {
        value: currentFleet.inactiveVehicles || 0,
        vsPrior: calculateVsPrior(
          currentFleet.inactiveVehicles || 0,
          previousFleet.inactiveVehicles || 0,
        ),
        distribution: inactiveVehicleDistribution,
      },
      fleetUtilizationPercent: {
        value: utilization,
        vsPrior: calculateVsPrior(
          utilization,
          previousFleet.fleetUtilizationPercent || 0,
        ),
        distribution: utilization,
      },
    };

    const getTrend = (curr: number, prev: number) => {
      if (prev === 0 && curr > 0) return "+100%";
      if (prev === 0 && curr === 0) return "Stable";
      const diff = curr - prev;
      const pct = (diff / prev) * 100;
      if (Math.abs(pct) < 0.1) return "Stable";
      return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    };

    return {
      summaryCards: {
        totalDeliveriesTrips: {
          value: fleetSummary.totalDeliveriesTrips,
          trend: getTrend(
            fleetSummary.totalDeliveriesTrips,
            previousFleetSummary.totalDeliveriesTrips,
          ),
        },
        deliveriesPerVehicle: {
          value: deliveriesPerVehicle,
          trend: getTrend(deliveriesPerVehicle, previousDeliveriesPerVehicle),
        },
        fleetUtilizationPercent: {
          value: utilization,
          trend: getTrend(
            utilization,
            previousFleet.fleetUtilizationPercent || 0,
          ),
        },
        driverEfficiency: {
          value: driverEfficiencyOverall,
          trend: getTrend(
            driverEfficiencyOverall,
            previousFleet.driverEfficiencyOverall || 0,
          ),
        },
      },
      coreOperations: driverPerformanceBlock, // Using the same data for core operations
      operationalHealth: {
        healthScore: healthScore,
        fleetEfficiency: utilization,
        deliverySuccessRate: onTimePercent,
        costEfficiency:
          currentFleet.costEfficiency !== undefined &&
          currentFleet.costEfficiency !== null
            ? currentFleet.costEfficiency
            : 0,
      },
      costEfficiency: costEfficiencyBlock,
      fleetDriverUtilization: fleetDriverUtilizationBlock,
      driverPerformance: driverPerformanceBlock,
    };
  }

  async exportOperationalOverviewCsv(
    company: any,
    queryDto: GetOperationalOverviewDto,
  ): Promise<string> {
    if (!company) {
      return "Metric,Value,Trend\n";
    }
    const data = await this.getOperationalOverview(company, queryDto);

    const formatCurrency = (val: any) =>
      val !== undefined && val !== null ? `$${val.toLocaleString()}` : "N/A";
    const formatPercent = (val: any) =>
      val !== undefined && val !== null ? `${val}%` : "N/A";
    const formatTrend = (trend: any) => (trend ? trend : "N/A");
    const formatChange = (val: number) => {
      if (val === undefined || val === null) return "N/A";
      return `${val >= 0 ? "+" : ""}${val}%`;
    };

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
    csv += `"          AI-CFO OPERATIONAL OVERVIEW             "\n`;
    csv += `"            COMPLETE OPERATIONS EXPORT            "\n`;
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
    csv += `Metric,Value,Trend\n`;
    const summaryCards = data.summaryCards || {};
    csv += `"Total Deliveries / Trips","${summaryCards.totalDeliveriesTrips?.value || 0}","${formatTrend(summaryCards.totalDeliveriesTrips?.trend)}"\n`;
    csv += `"Deliveries Per Vehicle","${summaryCards.deliveriesPerVehicle?.value || 0}","${formatTrend(summaryCards.deliveriesPerVehicle?.trend)}"\n`;
    csv += `"Fleet Utilization","${formatPercent(summaryCards.fleetUtilizationPercent?.value)}","${formatTrend(summaryCards.fleetUtilizationPercent?.trend)}"\n`;
    csv += `"Driver Efficiency","${formatPercent(summaryCards.driverEfficiency?.value)}","${formatTrend(summaryCards.driverEfficiency?.trend)}"\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 2: CORE OPERATIONS & DRIVER PERFORMANCE
    csv += `"SECTION 2: CORE OPERATIONS & DRIVER PERFORMANCE"\n`;
    csv += `Metric,Value,vs Prior Month (%),Distribution (%)\n`;
    const coreOps = data.coreOperations || {};
    csv += `"Total Deliveries / Trips","${coreOps.totalDeliveriesTrips?.value || 0}","${formatChange(coreOps.totalDeliveriesTrips?.vsPrior)}","${coreOps.totalDeliveriesTrips?.distribution || 100}%"\n`;
    csv += `"Deliveries Per Vehicle","${coreOps.deliveriesPerVehicle?.value || 0}","${formatChange(coreOps.deliveriesPerVehicle?.vsPrior)}","${coreOps.deliveriesPerVehicle?.distribution || 100}%"\n`;
    csv += `"On-time Delivery Rate","${formatPercent(coreOps.onTimeDeliveryPercent?.value)}","${formatChange(coreOps.onTimeDeliveryPercent?.vsPrior)}","${coreOps.onTimeDeliveryPercent?.distribution || 0}%"\n`;
    csv += `"Failed Delivery Rate","${formatPercent(coreOps.failedDeliveryPercent?.value)}","${formatChange(coreOps.failedDeliveryPercent?.vsPrior)}","${coreOps.failedDeliveryPercent?.distribution || 0}%"\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 3: OPERATIONAL HEALTH SCORES
    csv += `"SECTION 3: OPERATIONAL HEALTH SCORES"\n`;
    csv += `Metric,Score\n`;
    const health = data.operationalHealth || {};
    csv += `"Overall Health Score","${health.healthScore || 0}/100"\n`;
    csv += `"Fleet Efficiency","${health.fleetEfficiency || 0}%"\n`;
    csv += `"Delivery Success Rate","${health.deliverySuccessRate || 0}%"\n`;
    csv += `"Cost Efficiency","${health.costEfficiency || 0}%"\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 4: FLEET & DRIVER UTILIZATION
    csv += `"SECTION 4: FLEET & DRIVER UTILIZATION"\n`;
    csv += `Metric,Count,vs Prior Month (%),Distribution (%)\n`;
    const fdu = data.fleetDriverUtilization || {};
    csv += `"Total Vehicles","${fdu.totalVehicles?.value || 0}","${formatChange(fdu.totalVehicles?.vsPrior)}","100%"\n`;
    csv += `"Active Vehicles","${fdu.activeVehicles?.value || 0}","${formatChange(fdu.activeVehicles?.vsPrior)}","${fdu.activeVehicles?.distribution || 0}%"\n`;
    csv += `"Inactive Vehicles","${fdu.inactiveVehicles?.value || 0}","${formatChange(fdu.inactiveVehicles?.vsPrior)}","${fdu.inactiveVehicles?.distribution || 0}%"\n`;
    csv += `"Fleet Utilization Rate","${formatPercent(fdu.fleetUtilizationPercent?.value)}","${formatChange(fdu.fleetUtilizationPercent?.vsPrior)}","${fdu.fleetUtilizationPercent?.distribution || 0}%"\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 5: OPERATIONAL COST EFFICIENCY
    csv += `"SECTION 5: OPERATIONAL COST EFFICIENCY"\n`;
    csv += `Metric,Value,vs Prior Month (%)\n`;
    const costEff = data.costEfficiency || {};
    csv += `"Fuel Cost","${formatCurrency(costEff.fuelCost?.value)}","${formatChange(costEff.fuelCost?.vsPrior)}"\n`;
    csv += `"Maintenance Cost","${formatCurrency(costEff.maintenanceCost?.value)}","${formatChange(costEff.maintenanceCost?.vsPrior)}"\n`;
    csv += `"Cost Per Trip","${formatCurrency(costEff.costPerTrip?.value)}","${formatChange(costEff.costPerTrip?.vsPrior)}"\n`;
    csv += `"Cost Per Km","${formatCurrency(costEff.costPerKm?.value)}","${formatChange(costEff.costPerKm?.vsPrior)}"\n`;

    return csv;
  }
}

