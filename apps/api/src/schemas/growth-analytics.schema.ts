import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument } from './base.schema';

export type GrowthAnalyticsDocument = HydratedDocument<GrowthAnalytics>;

@Schema({ _id: false })
export class GrowthTrendItem {
  @Prop({ type: String, required: true })
  month!: string;

  @Prop({ type: Number, default: null })
  monthlyGrowthPercent!: number | null;

  @Prop({ type: Number, default: null })
  revenueGrowthPercent!: number | null;

  @Prop({ type: Number, default: null })
  clientGrowthPercent!: number | null;
}

export const GrowthTrendItemSchema = SchemaFactory.createForClass(GrowthTrendItem);

@Schema({ _id: false })
export class InsightItem {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  description!: string;
}

export const InsightItemSchema = SchemaFactory.createForClass(InsightItem);

@Schema({ timestamps: true })
export class GrowthAnalytics extends BaseDocument {
  // Common Metadata
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

  // Growth Metrics
  @Prop({ type: Number, default: null })
  clientCount!: number | null;

  @Prop({ type: Number, default: null })
  newClients!: number | null;

  @Prop({ type: Number, default: null })
  employeeCount!: number | null;

  // Growth Cards
  @Prop({ type: Number, default: null })
  monthlyGrowthPercent!: number | null;

  @Prop({ type: Number, default: null })
  quarterlyGrowthPercent!: number | null;

  @Prop({ type: Number, default: null })
  yearlyGrowthPercent!: number | null;

  @Prop({ type: Number, default: null })
  revenuePerClient!: number | null;

  @Prop({ type: Number, default: null })
  revenuePerEmployee!: number | null;

  @Prop({ type: Number, default: null })
  employeeGrowthPercent!: number | null;

  @Prop({ type: Number, default: null })
  clientGrowthPercent!: number | null;

  // Growth Health
  @Prop({ type: Number, default: null })
  growthHealthScore!: number | null;

  @Prop({ type: Number, default: null })
  revenueGrowthScore!: number | null;

  @Prop({ type: Number, default: null })
  clientRetentionScore!: number | null;

  @Prop({ type: Number, default: null })
  scalingEfficiencyScore!: number | null;

  // Growth Trend Graph
  @Prop({ type: [GrowthTrendItemSchema], default: [] })
  growthTrend!: GrowthTrendItem[];

  // AI Insights
  @Prop({ type: [InsightItemSchema], default: [] })
  insights!: InsightItem[];
}

export const GrowthAnalyticsSchema = SchemaFactory.createForClass(GrowthAnalytics);
