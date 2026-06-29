export enum ReportTypeEnum {
  INCOME_STATEMENT = "income_statement",
  BALANCE_SHEET = "balance_sheet",
  CASH_FLOW = "cash_flow",
  FINANCIAL_STATEMENT = "financial_statement",
  OTHER = "other",
}

export interface Report {
  id: string | number;
  period: string;
  type: string;
  status: string;
  uploadStatus?: string;
  dateRange: string;
  reportName?: string;
  reportType?: ReportTypeEnum;
  periodStartDate?: string;
  periodEndDate?: string;
  file?: any[];
}

export interface ReportStateProps {
  reports: any; // Allow object or array response from API
  loading: boolean;
  actionLoading: boolean;
  error: any;
  actionError: any;
  reportDetail: any | null;
  revenueTrend: any | null;
  expenseBreakdown: any | null;
}
