import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseDocument } from './base.schema';

import { TransactionTypeEnum, TransactionStatusEnum } from '../common/enums/transaction.enum';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction extends BaseDocument {
  @Prop({ required: true, type: String, ref: 'Company', index: true })
  companyId!: string;

  @Prop({ required: true, type: Date })
  date!: Date;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: Number })
  amount!: number;

  @Prop({ required: true, enum: TransactionTypeEnum })
  type!: string;

  @Prop({ type: String, enum: TransactionStatusEnum, default: TransactionStatusEnum.COMPLETED })
  status?: string;

  @Prop({ type: String, default: '' })
  notes?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
