import { Injectable } from "@nestjs/common";
import { ReportTypeEnum } from "../../common/enums/report.enum";
import { AnalyticsSchema, getDefaultAnalytics } from "../interfaces/analytics.interface";

@Injectable()
export class ReportMapperService {
  
  mapToAnalytics(reportType: ReportTypeEnum, rawData: any): AnalyticsSchema {
    const analytics = getDefaultAnalytics();
    if (!rawData) return analytics;

    // Common numerical parser
    const getNum = (val: any) => {
      if (val === null || val === undefined) return 0;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    switch (reportType) {
      case ReportTypeEnum.INCOME_STATEMENT:
        analytics.financial.revenue = getNum(rawData.revenue || rawData.totalRevenue || rawData.sales);
        analytics.financial.expenses = getNum(rawData.expenses || rawData.totalExpenses || rawData.operatingExpenses);
        analytics.financial.grossProfit = getNum(rawData.grossProfit || rawData.grossMargin);
        analytics.financial.ebitda = getNum(rawData.ebitda || rawData.operatingProfit);
        // We will strictly calculate net profit at aggregation level if needed, but we can capture it if provided
        analytics.financial.netProfit = getNum(rawData.netProfit);
        analytics.financial.netCashFlow = getNum(rawData.cashFlow || rawData.netCashFlow);
        analytics.financial.cashBalance = getNum(rawData.cashBalance || rawData.closingBalance);
        analytics.financial.cashInflow = getNum(rawData.cashInflow || rawData.totalInflow);
        analytics.financial.cashOutflow = getNum(rawData.cashOutflow || rawData.totalOutflow);
        break;

      case ReportTypeEnum.BALANCE_SHEET:
        // A balance sheet primarily deals with assets/liabilities, but if it has cash fields:
        analytics.financial.cashBalance = getNum(rawData.cashBalance || rawData.cashAndEquivalents || rawData.cash);
        analytics.financial.netCashFlow = getNum(rawData.cashFlow || rawData.netCashFlow);
        break;

      case ReportTypeEnum.CASH_FLOW:
        analytics.financial.netCashFlow = getNum(rawData.cashFlow || rawData.netCashFlow || rawData.operatingCashFlow);
        analytics.financial.cashInflow = getNum(rawData.cashInflow || rawData.totalInflow);
        analytics.financial.cashOutflow = getNum(rawData.cashOutflow || rawData.totalOutflow);
        analytics.financial.cashBalance = getNum(rawData.cashBalance || rawData.closingBalance);
        break;

      case ReportTypeEnum.FINANCIAL_STATEMENT:
      case ReportTypeEnum.OTHER:
      default:
        // Attempt to map everything available for general statements
        analytics.financial.revenue = getNum(rawData.revenue || rawData.totalRevenue);
        analytics.financial.expenses = getNum(rawData.expenses || rawData.totalExpenses);
        analytics.financial.grossProfit = getNum(rawData.grossProfit);
        analytics.financial.netProfit = getNum(rawData.netProfit);
        analytics.financial.ebitda = getNum(rawData.ebitda);
        analytics.financial.netCashFlow = getNum(rawData.cashFlow || rawData.netCashFlow);
        analytics.financial.cashBalance = getNum(rawData.cashBalance || rawData.closingBalance);
        analytics.financial.cashInflow = getNum(rawData.cashInflow || rawData.totalInflow);
        analytics.financial.cashOutflow = getNum(rawData.cashOutflow || rawData.totalOutflow);

        analytics.growth.clientCount = getNum(rawData.clientCount || rawData.totalClients);
        analytics.growth.newClients = getNum(rawData.newClients || rawData.acquiredClients);
        analytics.growth.employeeCount = getNum(rawData.employeeCount || rawData.totalEmployees);

        analytics.operational.totalVehicles = getNum(rawData.totalVehicles || rawData.vehicles);
        analytics.operational.activeVehicles = getNum(rawData.activeVehicles);
        analytics.operational.inactiveVehicles = getNum(rawData.inactiveVehicles);
        analytics.operational.totalDeliveries = getNum(rawData.totalDeliveries || rawData.deliveries);
        analytics.operational.onTimeDeliveries = getNum(rawData.onTimeDeliveries);
        analytics.operational.totalTrips = getNum(rawData.totalTrips);
        analytics.operational.completedTrips = getNum(rawData.completedTrips || rawData.trips);
        analytics.operational.cancelledTrips = getNum(rawData.cancelledTrips);
        analytics.operational.fuelCost = getNum(rawData.fuelCost);
        analytics.operational.maintenanceCost = getNum(rawData.maintenanceCost);
        analytics.operational.costPerTrip = getNum(rawData.costPerTrip);
        analytics.operational.costPerKm = getNum(rawData.costPerKm);
        break;
    }

    return analytics;
  }

  mapLlmToAnalytics(llmData: any): AnalyticsSchema {
    const analytics = getDefaultAnalytics();
    if (!llmData) return analytics;

    const getNum = (val: any) => {
      if (val === null || val === undefined) return 0;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    if (llmData.summary) {
      analytics.financial.revenue = getNum(llmData.summary.revenue);
      analytics.financial.expenses = getNum(llmData.summary.totalExpenses || llmData.summary.cogs);
      analytics.financial.grossProfit = getNum(llmData.summary.revenue) - getNum(llmData.summary.cogs);
      analytics.financial.netCashFlow = getNum(llmData.summary.netCashFlow);
      analytics.financial.cashBalance = getNum(llmData.summary.cashBalance);
    }

    if (llmData.fleet) {
      analytics.operational.totalVehicles = getNum(llmData.fleet.totalVehicles);
      analytics.operational.activeVehicles = getNum(llmData.fleet.activeVehicles);
      analytics.operational.inactiveVehicles = getNum(llmData.fleet.inactiveVehicles);
      analytics.operational.fuelCost = getNum(llmData.fleet.fuelCost);
      analytics.operational.maintenanceCost = getNum(llmData.fleet.maintenanceCost);
      analytics.operational.totalTrips = getNum(llmData.fleet.totalTrips);
      analytics.operational.completedTrips = getNum(llmData.fleet.completedTrips);
      // Gemini returns onTimePercent directly
    }

    if (llmData.growth) {
      analytics.growth.clientCount = getNum(llmData.growth.clientCount);
      analytics.growth.newClients = getNum(llmData.growth.newClients);
    }

    // Set onTimeDeliveries backwards based on completedTrips and onTimePercent if onTimePercent is provided by LLM
    if (llmData.fleet && llmData.fleet.onTimePercent) {
      const pct = getNum(llmData.fleet.onTimePercent);
      if (pct > 0 && analytics.operational.completedTrips > 0) {
        analytics.operational.onTimeDeliveries = Math.round((pct / 100) * analytics.operational.completedTrips);
      }
    }

    return analytics;
  }
}
