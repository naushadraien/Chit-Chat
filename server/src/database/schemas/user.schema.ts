import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export interface VerificationStatus {
  isPhoneVerified: boolean;
  isNameProvided?: boolean;
}

@Schema({
  timestamps: true,
  //transformation below is for sending the sufficient data in the response of api request from frontend
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.otp;
      delete ret.otpExpiresAt;
      delete ret.password;
      delete ret.hashedRefreshToken;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.otp;
      delete ret.otpExpiresAt;
      delete ret.password;
      delete ret.hashedRefreshToken;
      return ret;
    },
  },
})
export class User {
  @Prop({ default: null })
  firstName: string;

  @Prop({ default: null })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  hashedRefreshToken: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({
    default: null,
    validate: {
      validator: function (v: string) {
        return v === null || /^\+[1-9]\d{1,14}$/.test(v);
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

  @Prop({
    type: Object,
    default: {
      isPhoneVerified: false,
      isNameProvided: false,
    },
  })
  verificationStatus: VerificationStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function (this: UserDocument) {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
});
