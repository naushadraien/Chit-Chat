import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from 'src/database/schemas/session.schema';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { BcryptProvider } from 'src/modules/auth/providers/bcrypt.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SessionController],
  providers: [SessionService, BcryptProvider],
  exports: [SessionService],
})
export class SessionModule {}
