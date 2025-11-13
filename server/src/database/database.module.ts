import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { envs } from 'src/config/envs';

@Module({
  imports: [
    MongooseModule.forRoot(envs.MONGO_URI, {
      dbName: 'react-native-chat',
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private logger = new Logger();

  async onModuleInit() {
    // Wait for connection to be ready
    if (this.connection.readyState === 1) {
      this.logConnection();
    } else {
      // Wait for the connection event
      this.connection.once('connected', () => {
        this.logConnection();
      });
    }

    // Set up event listeners for future events
    this.connection.on('error', (error) => {
      this.logger.error('❌ MongoDB connection error:', error.message);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('⚠️  MongoDB disconnected');
    });

    this.connection.on('reconnected', () => {
      this.logger.log('🔄 MongoDB reconnected');
      this.logConnection();
    });
  }

  private logConnection() {
    this.logger.log('✅ MongoDB connected successfully');
    this.logger.log(`📊 Database: ${this.connection.name}`);
    this.logger.log(`🔗 Host: ${this.connection.host}:${this.connection.port}`);
  }
}
