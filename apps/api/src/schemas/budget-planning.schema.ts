import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument } from './base.schema';
import { BudgetCategory } from '../common/enums/budget-category.enum';

export type BudgetPlanningDocument = HydratedDocument<BudgetPlanning>;

@Schema({ _id: false }) // _id: false because it's a subdocument
export class BudgetLineItem {
  @Prop({ required: true, enum: BudgetCategory })
  category!: BudgetCategory;

  @Prop({ required: true })
  name!: string; // e.g., 'Forecast Revenue', 'Software Subscriptions'

  @Prop({ required: true, default: 0 })
  amount!: number;
}

const BudgetLineItemSchema = SchemaFactory.createForClass(BudgetLineItem);

@Schema({ _id: false })
export class BudgetSummaryItem {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, default: 0 })
  budget!: number;

  @Prop({ required: true, default: 0 })
  actual!: number;

  @Prop({ type: String, default: '' })
  notes?: string;
}

const BudgetSummaryItemSchema = SchemaFactory.createForClass(BudgetSummaryItem);

@Schema({ timestamps: true })
export class BudgetPlanning extends BaseDocument {
  @Prop({ required: true, type: String, ref: 'Company', index: true })
  companyId!: string;

  @Prop({ required: true, type: Number, index: true })
  month!: number;

  @Prop({ required: true, type: Number, index: true })
  year!: number;

  // Array of custom line items the user adds from the spreadsheet
  @Prop({ type: [BudgetLineItemSchema], default: [] })
  lineItems!: BudgetLineItem[];

  // Array of custom summary items
  @Prop({ type: [BudgetSummaryItemSchema], default: [] })
  summaryItems!: BudgetSummaryItem[];

  // Aggregated Totals (for quick card and table loading without recalculating)
  @Prop({ type: Number, default: 0 })
  totalRevenueBudget!: number;

  @Prop({ type: Number, default: 0 })
  totalDirectCostsBudget!: number;

  @Prop({ type: Number, default: 0 })
  totalOperatingExpensesBudget!: number;
}

export const BudgetPlanningSchema = SchemaFactory.createForClass(BudgetPlanning);

// Ensure there is only one budget plan per company, per month, per year
BudgetPlanningSchema.index({ companyId: 1, month: 1, year: 1 }, { unique: true });
