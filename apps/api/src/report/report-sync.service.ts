import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

@Injectable()
export class ReportSyncService {
  constructor(
    @InjectModel(DashboardSummary.name)
    private dashboardModel: Model<DashboardSummaryDocument>,
    @InjectModel(GrowthAnalytics.name)
    private growthModel: Model<GrowthAnalyticsDocument>,
    @InjectModel(FleetAnalytics.name)
    private fleetModel: Model<FleetAnalyticsDocument>,
  ) {}

  // || ---------------------- Sync data to Dashboards function ---------------------|| //
  async syncToDashboards(companyId: string) {
    // 1. Fetch all active reports for this company
    const collection = this.dashboardModel.db.collection(`company_${companyId}`);
    const reports = await collection.find({ collectionType: "report", deletedAt: null }).toArray();

    // Aggregation maps to group reports by time periods
    const monthlyMap = new Map<string, any>();
    const quarterlyMap = new Map<string, any>();
    const yearlyMap = new Map<string, any>();

    // Remove 'overall' entries completely from DB as they are no longer needed
    await Promise.all([
      this.dashboardModel.deleteMany({ companyId, periodType: 'overall' }),
      this.growthModel.deleteMany({ companyId, periodType: 'overall' }),
      this.fleetModel.deleteMany({ companyId, periodType: 'overall' })
    ]);

    // 2. Accumulate raw metrics into period buckets
    for (const report of reports) {
      // Use reportDate from the object, fallback to periodStartDate, then createdAt
      const dateVal = report.reportDate || report.periodStartDate || report.createdAt;
      const date = new Date(dateVal);
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
      const q = Math.floor(date.getMonth() / 3) + 1;
      const quarterKey = `${date.getFullYear()}-Q${q}`;
      const yearKey = `${date.getFullYear()}-01-01`;

      this.addMetrics(monthlyMap, monthKey, report);
      this.addMetrics(quarterlyMap, quarterKey, report);
      this.addMetrics(yearlyMap, yearKey, report);
    }

    // 3. Calculate derived metrics & Upsert
    await this.upsertMap(companyId, "monthly", monthlyMap);
    await this.upsertMap(companyId, "quarterly", quarterlyMap);
    await this.upsertMap(companyId, "yearly", yearlyMap);
  }

  // --- Helper Methods ---

  private getEmptyMetrics() {
    return {
      financial: { revenue: 0, totalExpenses: 0, ebitda: 0, netCashFlow: 0, grossProfit: 0, cashBalance: 0, cashInflow: 0, cashOutflow: 0 },
      growth: { clientCount: 0, newClients: 0, employeeCount: 0 },
      operational: { 
        totalVehicles: 0, activeVehicles: 0, inactiveVehicles: 0, 
        totalDeliveries: 0, onTimeDeliveries: 0, totalTrips: 0, 
        completedTrips: 0, cancelledTrips: 0, 
        fuelCost: 0, maintenanceCost: 0, costPerTrip: 0, costPerKm: 0 
      },
      reportCount: 0,
    };
  }

  private addMetrics(map: Map<string, any>, key: string, report: any) {
    if (!map.has(key)) map.set(key, this.getEmptyMetrics());
    this.addMetricsToObj(map.get(key), report);
  }

  private addMetricsToObj(obj: any, report: any) {
    const analytics = report.analytics || { financial: {}, growth: {}, operational: {} };
    const fin = analytics.financial || {};
    const grw = analytics.growth || {};
    const ops = analytics.operational || {};

    // Financials (SUM, except cashBalance which should ideally be the last one, but we'll take MAX or SUM depending on logic. Let's take MAX for cash balance for period)
    obj.financial.revenue += Number(fin.revenue || 0);
    obj.financial.totalExpenses += Number(fin.expenses || 0);
    obj.financial.grossProfit += Number(fin.grossProfit || 0);
    obj.financial.ebitda += Number(fin.ebitda || 0);
    obj.financial.netCashFlow += Number(fin.netCashFlow || fin.cashFlow || 0);
    obj.financial.cashInflow += Number(fin.cashInflow || 0);
    obj.financial.cashOutflow += Number(fin.cashOutflow || 0);
    obj.financial.cashBalance = Math.max(obj.financial.cashBalance, Number(fin.cashBalance || 0));

    // Growth (MAX - as it represents peak capacity/clients in a period)
    obj.growth.clientCount = Math.max(obj.growth.clientCount, Number(grw.clientCount || 0));
    obj.growth.employeeCount = Math.max(obj.growth.employeeCount, Number(grw.employeeCount || 0));
    obj.growth.newClients += Number(grw.newClients || 0);

    // Operational (MAX for vehicles, SUM for deliveries/trips/costs)
    obj.operational.totalVehicles = Math.max(obj.operational.totalVehicles, Number(ops.totalVehicles || 0));
    obj.operational.activeVehicles = Math.max(obj.operational.activeVehicles, Number(ops.activeVehicles || 0));
    obj.operational.inactiveVehicles = Math.max(obj.operational.inactiveVehicles, Number(ops.inactiveVehicles || 0));
    obj.operational.totalDeliveries += Number(ops.totalDeliveries || 0);
    obj.operational.onTimeDeliveries += Number(ops.onTimeDeliveries || 0);
    obj.operational.totalTrips += Number(ops.totalTrips || 0);
    obj.operational.completedTrips += Number(ops.completedTrips || 0);
    obj.operational.cancelledTrips += Number(ops.cancelledTrips || 0);
    obj.operational.fuelCost += Number(ops.fuelCost || 0);
    obj.operational.maintenanceCost += Number(ops.maintenanceCost || 0);
    
    // costPerTrip and costPerKm should be averages or recalculated
    // For simplicity, we can accumulate and then recalculate them during payload mapping
    obj.operational.costPerTrip += Number(ops.costPerTrip || 0);
    obj.operational.costPerKm += Number(ops.costPerKm || 0);

    obj.reportCount += 1;
  }

  private calculateDerivedMetrics(obj: any) {
    const fin = obj.financial;
    const ops = obj.operational;
    const grw = obj.growth;

    const netProfit = fin.revenue - fin.totalExpenses;
    
    // Percentage Calculations
    const grossMarginPercent = fin.revenue > 0 ? (fin.grossProfit / fin.revenue) * 100 : 0;
    const netProfitMarginPercent = fin.revenue > 0 ? (netProfit / fin.revenue) * 100 : 0;
    const ebitdaMarginPercent = fin.revenue > 0 ? (fin.ebitda / fin.revenue) * 100 : 0;
    
    const profitMargin = netProfitMarginPercent; // Kept for backwards compatibility
    const fleetUtilizationPercent = ops.totalVehicles > 0 ? (ops.activeVehicles / ops.totalVehicles) * 100 : 0;

    // Simple automated mock logic for Health Scores
    const financialHealthScore = fin.revenue > 0 && profitMargin > 0 ? 85 : 50;
    const growthHealthScore = grw.clientCount > 0 ? 80 : 50;

    return {
      netProfit,
      profitMargin, // Fallback alias
      grossMarginPercent,
      netProfitMarginPercent,
      ebitdaMarginPercent,
      fleetUtilizationPercent,
      financialHealthScore,
      growthHealthScore,
    };
  }

  private async upsertMap(companyId: string, periodType: string, map: Map<string, any>) {
    for (const [dateKey, rawMetrics] of map.entries()) {
      let startDate = new Date();
      if (periodType === "monthly" || periodType === "yearly") {
        startDate = new Date(dateKey);
      } else if (periodType === "quarterly") {
        const parts = dateKey.split("-Q");
        if (parts.length === 2) {
          const year = parseInt(parts[0], 10);
          const q = parseInt(parts[1], 10);
          startDate = new Date(year, (q - 1) * 3, 1);
        }
      }
      await this.upsertSingle(companyId, periodType, startDate, rawMetrics);
    }
  }

  private async upsertSingle(companyId: string, periodType: string, periodStartDate: Date | null, rawMetrics: any) {
    const derived = this.calculateDerivedMetrics(rawMetrics);

    const dashboardPayload = {
      companyId,
      periodType,
      periodStartDate,
      revenue: rawMetrics.financial.revenue,
      grossProfit: rawMetrics.financial.grossProfit,
      ebitda: rawMetrics.financial.ebitda,
      totalExpenses: rawMetrics.financial.totalExpenses,
      cashBalance: rawMetrics.financial.cashBalance,
      cashInflow: rawMetrics.financial.cashInflow,
      cashOutflow: rawMetrics.financial.cashOutflow,
      netCashFlow: rawMetrics.financial.netCashFlow,
      netProfit: derived.netProfit,
      grossMarginPercent: derived.grossMarginPercent,
      netProfitMarginPercent: derived.netProfitMarginPercent,
      ebitdaMarginPercent: derived.ebitdaMarginPercent,
      financialHealthScore: derived.financialHealthScore,
    };

    const growthPayload = {
      companyId,
      periodType,
      periodStartDate,
      clientCount: rawMetrics.growth.clientCount,
      employeeCount: rawMetrics.growth.employeeCount,
      growthHealthScore: derived.growthHealthScore,
    };

    const onTimePercent = rawMetrics.operational.totalDeliveries > 0 ? (rawMetrics.operational.onTimeDeliveries / rawMetrics.operational.totalDeliveries) * 100 : 0;
    
    // Average costs over the number of reports synced (for per-unit costs)
    const avgCostPerTrip = rawMetrics.reportCount > 0 ? (rawMetrics.operational.costPerTrip / rawMetrics.reportCount) : 0;
    const avgCostPerKm = rawMetrics.reportCount > 0 ? (rawMetrics.operational.costPerKm / rawMetrics.reportCount) : 0;

    const fleetPayload = {
      companyId,
      periodType,
      periodStartDate,
      totalDeliveries: rawMetrics.operational.totalDeliveries,
      onTimeDeliveries: rawMetrics.operational.onTimeDeliveries,
      onTimePercent: onTimePercent,
      totalVehicles: rawMetrics.operational.totalVehicles,
      activeVehicles: rawMetrics.operational.activeVehicles,
      inactiveVehicles: rawMetrics.operational.inactiveVehicles,
      totalTrips: rawMetrics.operational.totalTrips,
      completedTrips: rawMetrics.operational.completedTrips,
      cancelledTrips: rawMetrics.operational.cancelledTrips,
      fleetUtilizationPercent: derived.fleetUtilizationPercent,
      fuelCost: rawMetrics.operational.fuelCost,
      maintenanceCost: rawMetrics.operational.maintenanceCost,
      costPerTrip: avgCostPerTrip,
      costPerKm: avgCostPerKm,
    };

    const query = { companyId, periodType, periodStartDate };

    await Promise.all([
      this.dashboardModel.findOneAndUpdate(
        query,
        { $set: dashboardPayload },
        { upsert: true, new: true },
      ),
      this.growthModel.findOneAndUpdate(
        query,
        { $set: growthPayload },
        { upsert: true, new: true },
      ),
      this.fleetModel.findOneAndUpdate(
        query,
        { $set: fleetPayload },
        { upsert: true, new: true },
      ),
    ]);
  }
}
