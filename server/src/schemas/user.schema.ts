import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  hashedRefreshToken: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({
    required: true,
    validate: {
      validator: function (v: string) {
        return /^\+[1-9]\d{1,14}$/.test(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid phone number!`,
    },
  })
  phoneNumber: string;

  @Prop({ default: null })
  otp: string;

  @Prop({ default: null })
  otpExpiresAt: Date;

  @Prop({ default: false })
  isPhoneVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
