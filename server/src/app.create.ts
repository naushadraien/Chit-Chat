import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { corsOptions } from './config/cors-options';

export function appCreate(app: INestApplication): void {
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('React Native Chat Api')
    .setDescription('This react native chat backend built with Nestjs')
    .setVersion('1.0')
    .setTermsOfService('http://localhost:4000/termsofservice')
    .setLicense('MIT License', '')
    .addServer('http://localhost:4000')
    // Add Bearer Auth configuration
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer-auth', // This name should match the name used in @ApiBearerAuth()
    )
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.setGlobalPrefix('api/v1');
  app.enableCors(corsOptions);
}
