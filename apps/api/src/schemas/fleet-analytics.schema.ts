import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument } from './base.schema';

export type FleetAnalyticsDocument = HydratedDocument<FleetAnalytics>;

@Schema({ timestamps: true })
export class FleetAnalytics extends BaseDocument {
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
  totalVehicles!: number | null;

  @Prop({ type: Number, default: null })
  activeVehicles!: number | null;

  @Prop({ type: Number, default: null })
  inactiveVehicles!: number | null;

  @Prop({ type: Number, default: null })
  fleetUtilizationPercent!: number | null;

  @Prop({ type: Number, default: null })
  totalTrips!: number | null;

  @Prop({ type: Number, default: null })
  completedTrips!: number | null;

  @Prop({ type: Number, default: null })
  cancelledTrips!: number | null;

  @Prop({ type: Number, default: null })
  fuelCost!: number | null;

  @Prop({ type: Number, default: null })
  maintenanceCost!: number | null;

  @Prop({ type: Number, default: null })
  costPerTrip!: number | null;

  @Prop({ type: Number, default: null })
  costPerKm!: number | null;

  @Prop({ type: Number, default: null })
  totalDeliveries!: number | null;

  @Prop({ type: Number, default: null })
  onTimeDeliveries!: number | null;

  @Prop({ type: Number, default: null })
  onTimePercent!: number | null;

  @Prop({ type: Number, default: null })
  driverEfficiencyOverall?: number | null;

  @Prop({ type: Number, default: null })
  costEfficiency?: number | null;
}

export const FleetAnalyticsSchema = SchemaFactory.createForClass(FleetAnalytics);
