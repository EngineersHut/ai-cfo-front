import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument } from './base.schema';

export type NotificationSettingsDocument = HydratedDocument<NotificationSettings>;

@Schema()
export class NotificationSettings extends BaseDocument {
  @Prop({ required: true, type: String, ref: 'User', unique: true })
  userId!: string;

  @Prop({ required: true, type: Boolean, default: true })
  emailNotifications!: boolean;

  @Prop({ required: true, type: Boolean, default: true })
  alertsForFinancialRisks!: boolean;

  @Prop({ required: true, type: Boolean, default: true })
  weeklySummaryReports!: boolean;
}

export const NotificationSettingsSchema = SchemaFactory.createForClass(NotificationSettings);
