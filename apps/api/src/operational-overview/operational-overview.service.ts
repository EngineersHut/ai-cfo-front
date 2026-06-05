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
    const { period } = queryDto;
    const companyId = company._id.toString();

    const typeQuery = {
      companyId,
      periodType: period.toLowerCase(),
    };

    if (company.industry === IndustryEnum.FLEET_MANAGEMENT) {
      return this.getFleetOperationalOverview(companyId, typeQuery);
    }

    return {
      message: `Operational Overview for industry ${company.industry} is not implemented yet.`,
    };
  }

  // || ---------------------- Get Fleet Operational Overview Data function ---------------------|| //
  private async getFleetOperationalOverview(companyId: string, typeQuery: any) {
    const [dashboardData, fleetData] = await Promise.all([
      this.dashboardModel
        .find(typeQuery)
        .sort({ periodStartDate: -1 })
        .limit(2)
        .exec(),
      this.fleetModel
        .find(typeQuery)
        .sort({ periodStartDate: -1 })
        .limit(2)
        .exec(),
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

    const driverEfficiencyOverall = currentFleet.onTimePercent || 0; // Using on-time percent as a proxy for driver efficiency

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

    const activeVehicleDistribution = fleetSummary.totalVehicles > 0 ? parseFloat((((currentFleet.activeVehicles || 0) / fleetSummary.totalVehicles) * 100).toFixed(2)) : 0;
    const inactiveVehicleDistribution = fleetSummary.totalVehicles > 0 ? parseFloat((((currentFleet.inactiveVehicles || 0) / fleetSummary.totalVehicles) * 100).toFixed(2)) : 0;

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

    return {
      summaryCards: {
        totalDeliveriesTrips: fleetSummary.totalDeliveriesTrips,
        deliveriesPerVehicle: deliveriesPerVehicle,
        fleetUtilizationPercent: utilization,
        driverEfficiency: driverEfficiencyOverall,
      },
      coreOperations: driverPerformanceBlock, // Using the same data for core operations
      operationalHealth: {
        healthScore: healthScore,
        fleetEfficiency: utilization,
        deliverySuccessRate: onTimePercent,
        costEfficiency: 100, // Placeholder until benchmark is added
      },
      costEfficiency: costEfficiencyBlock,
      fleetDriverUtilization: fleetDriverUtilizationBlock,
      driverPerformance: driverPerformanceBlock,
    };
  }
}
