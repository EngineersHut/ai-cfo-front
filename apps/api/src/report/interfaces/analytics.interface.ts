export interface AnalyticsSchema {
  financial: {
    revenue: number;
    expenses: number;
    grossProfit: number;
    netProfit: number;
    ebitda: number;
    netCashFlow: number;
    cashBalance: number;
    cashInflow: number;
    cashOutflow: number;
    netProfitMarginPercent: number;
    grossMarginPercent: number;
  };
  growth: {
    clientCount: number;
    newClients: number;
    employeeCount: number;
  };
  operational: {
    totalVehicles: number;
    activeVehicles: number;
    inactiveVehicles: number;
    totalDeliveries: number;
    onTimeDeliveries: number;
    totalTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    fuelCost: number;
    maintenanceCost: number;
    costPerTrip: number;
    costPerKm: number;
  };
}

export function getDefaultAnalytics(): AnalyticsSchema {
  return {
    financial: {
      revenue: 0,
      expenses: 0,
      grossProfit: 0,
      netProfit: 0,
      ebitda: 0,
      netCashFlow: 0,
      cashBalance: 0,
      cashInflow: 0,
      cashOutflow: 0,
      netProfitMarginPercent: 0,
      grossMarginPercent: 0,
    },
    growth: {
      clientCount: 0,
      newClients: 0,
      employeeCount: 0,
    },
    operational: {
      totalVehicles: 0,
      activeVehicles: 0,
      inactiveVehicles: 0,
      totalDeliveries: 0,
      onTimeDeliveries: 0,
      totalTrips: 0,
      completedTrips: 0,
      cancelledTrips: 0,
      fuelCost: 0,
      maintenanceCost: 0,
      costPerTrip: 0,
      costPerKm: 0,
    },
  };
}
