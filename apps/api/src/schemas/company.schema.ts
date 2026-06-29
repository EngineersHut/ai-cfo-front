import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

import { BaseDocument } from './base.schema';

import { IndustryEnum, CurrencyEnum } from '../common/enums/company.enum';

@Schema()
export class Company extends BaseDocument {
  @Prop({ required: true, type: String, ref: 'User' })
  userId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  industry!: string;

  @Prop({ required: false })
  subIndustry!: string;

  @Prop({ required: true, enum: CurrencyEnum })
  currency!: string;

  @Prop({ default: false })
  isPrimary!: boolean;

}

export const CompanySchema = SchemaFactory.createForClass(Company);
