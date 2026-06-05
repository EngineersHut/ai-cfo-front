import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, _id: false })
export class BaseDocument {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id!: string;

  @Prop({ default: null })
  deletedAt!: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
