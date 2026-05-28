import React, { FunctionComponent, ReactElement } from 'react';

// material-ui
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { ChipProps } from '@mui/material/Chip';
import { TableCellProps } from '@mui/material/TableCell';

// project imports
// import { TablerIcon } from '@tabler/icons';
import { CompanyProfileStateProps } from './companyProfile';
import { CompanySettingStateProps } from './companySetting';
import { ProjectsStateProps } from './projects';
import { TimeSheetsStateProps } from './timeSheets';
import { TasksStateProps } from './tasks';
import { UserStateProps } from './user';
import { UserRoleStateProps } from './userRole';
import { SubTasksStateProps } from './subtasks';
import { LeavesStateProps } from './leaves';
import { LeaveTypeStateProps } from './leaveType';
import { ExpenseCategoryStateProps } from './expenceCategory';
import { ExpenseStateProps } from './expence';
import { DocumentsStateProps } from './document';
import { AttendanceStateProps } from './attendance';
import { RoleAccessStateProps } from './roleaccess';
import { DashboardStateProps } from './dashboard';
import { IssuesStateProps } from './issues';
import { TimeTrackingStateProps } from './timeTracking';
import { CommentsStateProps } from './comments';
import { CommonStateProps } from './common';
import { SalarySlipCategoryStateProps } from './salarySlipCategory';
import { SalaryStructureStateProps } from './salaryStructure';
import { SalarySlipStateProps } from './salaryslip';
import { AppraisalStateProps } from './appraisal';
import { AppraisalFormStateProps } from './appraisalForm';
import { AppraisallStateProps } from './appraisall';
import { ChatStateProps } from './chat';
import { AuthStateProps } from './auth';
import { NotificationsStateProps } from './notifications';
import { TaxStateProps } from './tax';
import { ClientsStateProps } from './clients';
import { OrganizationsStateProps } from './organizations';

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
  iconPrimary?: OverrideIcon;
  color?: string;
  size?: string;
}

export type OverrideIcon =
  | (OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
      muiName: string;
    })
  | React.ComponentClass<any>
  | FunctionComponent<any>
  | any;

export interface EnhancedTableHeadProps extends TableCellProps {
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  order: ArrangementOrder;
  orderBy?: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: (e: React.SyntheticEvent, p: string) => void;
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
}

export type HeadCell = {
  id: string;
  numeric: boolean;
  label: string;
  disablePadding?: string | boolean | undefined;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type NavItemType = {
  id?: string;
  link?: string;
  icon?: GenericCardProps['iconPrimary'];
  target?: boolean;
  external?: boolean;
  url?: string | undefined;
  type?: string;
  title?: string;
  color?: 'primary' | 'secondary' | 'default' | undefined;
  caption?: string;
  breadcrumbs?: boolean;
  disabled?: boolean;
  chip?: ChipProps;
  children?: NavItemType[];
  elements?: NavItemType[];
  search?: string;
};

export type AuthSliderProps = {
  title: string;
  description: string;
};

export interface ColorPaletteProps {
  color: string;
  label: string;
  value: string;
}

export interface DefaultRootStateProps {
  companyProfile: CompanyProfileStateProps;
  companySettings: CompanySettingStateProps;
  projects: ProjectsStateProps;
  timeSheets: TimeSheetsStateProps;
  tasks: TasksStateProps;
  leaves: LeavesStateProps;
  leaveType: LeaveTypeStateProps;
  expenseCategory: ExpenseCategoryStateProps;
  expense: ExpenseStateProps;
  users: UserStateProps;
  userRole: UserRoleStateProps;
  subtasks: SubTasksStateProps;
  issues: IssuesStateProps;
  comments: CommentsStateProps;
  document: DocumentsStateProps;
  attendance: AttendanceStateProps;
  roleaccess: RoleAccessStateProps;
  dashboard: DashboardStateProps;
  timetracking: TimeTrackingStateProps;
  common: CommonStateProps;
  salarySlipCategory: SalarySlipCategoryStateProps;
  salaryStructure: SalaryStructureStateProps;
  salarySlip: SalarySlipStateProps;
  appraisal: AppraisalStateProps;
  appraisalForm: AppraisalFormStateProps;
  appraisall: AppraisallStateProps;
  auth: AuthStateProps;
  chat: ChatStateProps;
  notifications: NotificationsStateProps;
  tax: TaxStateProps;
  client: ClientsStateProps;
  organizations: OrganizationsStateProps;
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
