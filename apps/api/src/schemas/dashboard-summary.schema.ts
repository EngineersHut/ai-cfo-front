import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument } from './base.schema';

export type DashboardSummaryDocument = HydratedDocument<DashboardSummary>;

@Schema({ _id: false })
export class ExpenseCategory {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  value!: number;

  @Prop({ required: true })
  percentage!: number;

  @Prop({ type: String, default: "Completed" })
  tags?: string;

  @Prop({ type: String, default: "" })
  note?: string;
}
const ExpenseCategorySchema = SchemaFactory.createForClass(ExpenseCategory);

@Schema({ timestamps: true })
export class DashboardSummary extends BaseDocument {
  @Prop({ required: true, type: String, ref: 'Company', index: true })
  companyId!: string;

  @Prop({ type: Number, default: null, index: true })
  month?: number | null;

  @Prop({ type: Number, default: null, index: true })
  year?: number | null;

  @Prop({ type: Date, default: null })
  periodStartDate?: Date | null;

  @Prop({ type: Date, default: null })
  periodEndDate?: Date | null;

  @Prop({ type: Number, default: null })
  revenue!: number | null;

  @Prop({ type: Number, default: null })
  grossProfit!: number | null;

  @Prop({ type: Number, default: null })
  netProfit!: number | null;

  @Prop({ type: Number, default: null })
  ebitda!: number | null;

  @Prop({ type: Number, default: null })
  totalExpenses!: number | null;

  @Prop({ type: [ExpenseCategorySchema], default: [] })
  expenseBreakdown!: ExpenseCategory[];

  @Prop({ type: Number, default: null })
  cashBalance!: number | null;

  @Prop({ type: Number, default: null })
  cashInflow!: number | null;

  @Prop({ type: Number, default: null })
  cashOutflow!: number | null;

  @Prop({ type: Number, default: null })
  netCashFlow!: number | null;

  @Prop({ type: Number, default: null })
  grossMarginPercent!: number | null;

  @Prop({ type: Number, default: null })
  netProfitMarginPercent!: number | null;

  @Prop({ type: Number, default: null })
  ebitdaMarginPercent!: number | null;

  @Prop({ type: Number, default: null })
  financialHealthScore!: number | null;

  @Prop({ type: Number, default: null })
  auditCompliance?: number | null;

  @Prop({ type: Number, default: null })
  growthPercent?: number | null;

  @Prop({ type: Number, default: null })
  equityHealth?: number | null;
}

export const DashboardSummarySchema = SchemaFactory.createForClass(DashboardSummary);
