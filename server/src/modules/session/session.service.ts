import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BcryptProvider } from 'src/modules/auth/providers/bcrypt.provider';
import {
  DeviceInfo,
  Session,
  SessionDocument,
} from 'src/database/schemas/session.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,

    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async createSession(
    userId: string,
    refreshToken: string,
    deviceInfo: DeviceInfo,
    expiresAt: Date,
  ): Promise<SessionDocument> {
    const hashedRefreshToken = await this.bcryptProvider.hashData(refreshToken);

    // Check if a session already exists for this device
    const existingSession = await this.sessionModel.findOne({
      userId: new Types.ObjectId(userId),
      'deviceInfo.deviceId': deviceInfo.deviceId,
      isActive: true,
    });

    if (existingSession) {
      // Update existing session
      existingSession.refreshToken = hashedRefreshToken;
      existingSession.expiresAt = expiresAt;
      existingSession.lastActivityAt = new Date();
      existingSession.deviceInfo = deviceInfo;
      return await existingSession.save();
    }

    // Create new session
    const session = new this.sessionModel({
      userId: new Types.ObjectId(userId),
      refreshToken: hashedRefreshToken,
      deviceInfo,
      expiresAt,
      lastActivityAt: new Date(),
      isActive: true,
    });

    return await session.save();
  }

  async validateRefreshToken(
    refreshToken: string,
    deviceId: string,
  ): Promise<SessionDocument | null> {
    const sessions = await this.sessionModel
      .find({
        'deviceInfo.deviceId': deviceId,
        isActive: true,
        expiresAt: { $gt: new Date() },
      })
      .exec();

    for (const session of sessions) {
      const isValid = await this.bcryptProvider.compareData(
        refreshToken,
        session.refreshToken,
      );
      if (isValid) {
        // Update last activity
        session.lastActivityAt = new Date();
        await session.save();
        return session;
      }
    }

    return null;
  }

  async getActiveSessions(userId: string): Promise<SessionDocument[]> {
    return await this.sessionModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
        expiresAt: { $gt: new Date() },
      })
      .sort({ lastActivityAt: -1 })
      .exec();
  }

  async revokeSession(
    sessionId: string,
    reason: string = 'user_logout',
  ): Promise<boolean> {
    const result = await this.sessionModel.updateOne(
      { _id: new Types.ObjectId(sessionId) },
      {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    );

    return result.modifiedCount > 0;
  }

  async revokeAllSessionsExceptCurrent(
    userId: string,
    currentSessionId: string,
  ): Promise<number> {
    const result = await this.sessionModel.updateMany(
      {
        userId: new Types.ObjectId(userId),
        _id: { $ne: new Types.ObjectId(currentSessionId) },
        isActive: true,
      },
      {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: 'user_logout_others',
      },
    );

    return result.modifiedCount;
  }

  async revokeAllSessions(userId: string): Promise<number> {
    const result = await this.sessionModel.updateMany(
      {
        userId: new Types.ObjectId(userId),
        isActive: true,
      },
      {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: 'user_logout_all',
      },
    );

    return result.modifiedCount;
  }

  async getSessionById(sessionId: string): Promise<SessionDocument | null> {
    return await this.sessionModel.findById(sessionId).exec();
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.sessionModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return result.deletedCount;
  }
}
