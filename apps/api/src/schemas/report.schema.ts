import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseDocument } from "./base.schema";
import { ReportTypeEnum, ReportStatusEnum } from "../common/enums/report.enum";

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report extends BaseDocument {
  @Prop({ required: true, type: String, ref: "Company" })
  companyId!: string;

  @Prop({ required: true, type: String, ref: "User" })
  uploadedBy!: string;

  @Prop({ required: true })
  reportName!: string;

  @Prop({ required: true, enum: ReportTypeEnum })
  reportType!: string;

  @Prop({ default: null })
  periodStartDate?: Date;

  @Prop({ default: null })
  periodEndDate?: Date;

  @Prop({ required: true })
  originalFileName!: string;

  @Prop({ required: true })
  storedFileName!: string;

  @Prop({ required: true })
  filePath!: string;

  @Prop({ required: true })
  mimeType!: string;

  @Prop({ required: true })
  fileExtension!: string;

  @Prop({ required: true })
  fileSize!: number;

  @Prop({
    required: true,
    enum: ReportStatusEnum,
    default: ReportStatusEnum.PROCESSING,
  })
  uploadStatus!: string;

  @Prop({ default: null })
  analysisId?: string;

  @Prop({ default: null })
  processingStartedAt?: Date;

  @Prop({ default: null })
  processingCompletedAt?: Date;

  @Prop({ default: null })
  errorMessage?: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
