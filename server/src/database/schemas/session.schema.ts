import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

export interface DeviceInfo {
  deviceId: string; // Unique device identifier from the client
  deviceName?: string; // e.g., "iPhone 13 Pro"
  deviceType?: string; // "mobile" | "tablet" | "desktop" | "web"
  osName?: string; // e.g., "iOS", "Android"
  osVersion?: string; // e.g., "15.0"
  appVersion?: string; // Your app version
  browser?: string; // For web clients
  ipAddress?: string;
  userAgent?: string;
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.refreshToken; // Never expose refresh token
      return ret;
    },
  },
})
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  refreshToken: string; // Hashed refresh token

  @Prop({ type: Object, required: true })
  deviceInfo: DeviceInfo;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastActivityAt: Date;

  @Prop()
  revokedAt?: Date;

  @Prop()
  revokedReason?: string; // "user_logout" | "admin_revoke" | "suspicious_activity" | "token_expired"
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Indexes for performance
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ refreshToken: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-cleanup
