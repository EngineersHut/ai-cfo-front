import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type DashboardConfigDocument = HydratedDocument<DashboardConfig>;

import { BaseDocument } from './base.schema';

@Schema()
export class DashboardConfig extends BaseDocument {
  @Prop({ type: String, ref: 'User', required: true, unique: true })
  userId!: string;

  @Prop({ default: true }) totalTrips!: boolean;
  @Prop({ default: true }) delPerVeh!: boolean;
  @Prop({ default: true }) fleetUtil!: boolean;
  @Prop({ default: true }) driverEff!: boolean;
  
  @Prop({ default: true }) runway!: boolean;
  @Prop({ default: true }) growth!: boolean;
  @Prop({ default: true }) ebitda!: boolean;
  @Prop({ default: true }) cashflow!: boolean;
  
  @Prop({ default: true }) revTime!: boolean;
  @Prop({ default: true }) health!: boolean;
  
  @Prop({ default: true }) expenseBreakdown!: boolean;
  @Prop({ default: true }) aiInsights!: boolean;
  @Prop({ default: true }) costAnalysis!: boolean;
}

export const DashboardConfigSchema = SchemaFactory.createForClass(DashboardConfig);
