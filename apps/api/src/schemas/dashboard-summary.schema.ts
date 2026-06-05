import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument } from './base.schema';

export type DashboardSummaryDocument = HydratedDocument<DashboardSummary>;

@Schema({ timestamps: true })
export class DashboardSummary extends BaseDocument {
  @Prop({ required: true, type: String, ref: 'Company', index: true })
  companyId!: string;

  @Prop({ required: true, enum: ['overall', 'weekly', 'monthly', 'quarterly', 'yearly'], default: 'overall', index: true })
  periodType!: string;

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
}

export const DashboardSummarySchema = SchemaFactory.createForClass(DashboardSummary);
