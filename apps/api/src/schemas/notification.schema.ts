import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BaseDocument } from "./base.schema";
import { NotificationTypeEnum } from "../common/enums/notification.enum";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification extends BaseDocument {
  @Prop({ required: true, type: String, ref: "User" })
  userId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({
    required: true,
    enum: NotificationTypeEnum,
    default: NotificationTypeEnum.INFO,
  })
  type!: string;

  @Prop({ default: false })
  isRead!: boolean;

  @Prop({ type: Object, default: {} })
  metaData!: any; // e.g. reportId, companyId
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
