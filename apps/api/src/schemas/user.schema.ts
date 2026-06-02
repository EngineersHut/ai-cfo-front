import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseDocument } from "./base.schema";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends BaseDocument {
  @Prop({
    required: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    required: true,
  })
  password!: string;
  @Prop({
    required: true,
    default: "local",
  })
  provider!: string;
  @Prop({
    default: "",
  })
  providerId!: string;

  @Prop({
    default: null,
  })
  resetOtp!: number;

  @Prop({
    default: null,
  })
  resetOtpExpires!: Date;

  @Prop({
    default: null,
  })
  profilePic?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
