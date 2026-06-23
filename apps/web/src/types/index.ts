import React, { FunctionComponent, ReactElement } from 'react';


// project imports
// import { TablerIcon } from '@tabler/icons';

import { AuthStateProps } from './auth';
import { UserStateProps } from './user';
import { DashboardStateProps } from './dashboard';
import { CompanyStateProps } from './company';
import { ReportStateProps, ReportTypeEnum, Report } from './report';
import { OperationalStateProps } from './operational';
import { GrowthStateProps } from './growth';
import { BudgetStateProps } from './budget';


export type ArrangementOrder = 'asc' | 'desc' | undefined;


export type DateRange = { start: number | Date; end: number | Date };

export type GetComparator = (o: ArrangementOrder, o1: string) => (a: KeyedObject, b: KeyedObject) => number;

export type Direction = 'up' | 'down' | 'right' | 'left';

export interface TabsProps {
  children?: React.ReactElement | React.ReactNode | string;
  value: string | number;
  index: number;
}

export interface GenericCardProps {
  title?: string;
  primary?: string | number | undefined;
  secondary?: string;
  content?: string;
  image?: string;
  dateTime?: string;
  color?: string;
  size?: string;
}

export type HeadCell = {
  id: string;
  numeric: boolean;
  label: string;
  disablePadding?: string | boolean | undefined;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';



export type AuthSliderProps = {
  title: string;
  description: string;
};

export interface ColorPaletteProps {
  color: string;
  label: string;
  value: string;
}

export interface NotificationStateProps {
  settings: {
    emailNotifications: boolean;
    alertsForFinancialRisks: boolean;
    weeklySummaryReports: boolean;
  };
  loading: boolean;
  actionLoading: boolean;
  error: any;
  actionError: any;
}

export interface UserRoleStateProps {
  error: any;
  allUserRole: any[];
  loading: boolean;
  deleteActionError: any;
  createError: any;
  count: number;
  actionLoading: boolean;
}

export interface DefaultRootStateProps {
  auth: AuthStateProps;
  user: UserStateProps;
  dashboard: DashboardStateProps;
  company: CompanyStateProps;
  notification: NotificationStateProps;
  realtimeNotification: any; // Type handled by slice
  report: ReportStateProps;
  operational: OperationalStateProps;
  growth: GrowthStateProps;
  budget: BudgetStateProps;
  userRole: UserRoleStateProps;
}

export interface ColorProps {
  readonly [key: string]: string;
}

export type GuardProps = {
  children: ReactElement | null;
};

export interface StringColorProps {
  id?: string;
  label?: string;
  color?: string;
  primary?: string;
  secondary?: string;
}

export interface FormInputProps {
  bug: KeyedObject;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | undefined;
  label: string;
  name: string;
  required?: boolean;
  InputProps?: {
    label: string;
    startAdornment?: React.ReactNode;
  };
}

/** ---- Common Functions types ---- */

export type StringBoolFunc = (s: string) => boolean;
export type StringNumFunc = (s: string) => number;
export type NumbColorFunc = (n: number) => StringColorProps | undefined;
export type ChangeEventFunc = (e: React.ChangeEvent<HTMLInputElement>) => void;

export type KeyedObject = {
  [key: string]: string | number | KeyedObject | any;
};

export { ReportTypeEnum };
export type { Report };
