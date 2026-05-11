import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    // Validation pipe
    new ValidationPipe({
      enableDebugMessages: false,
      exceptionFactory: (errors) => {
        if (errors.length > 0) {
          throw new BadRequestException({
            message: 'Validation failed',
            statusCode: 400,
            success: false,
          });
        }
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Jewellery Feedback')
    .setDescription('Jewellery Feedback API description')
    .setVersion('1.0')
    // Application uses bearer authentication in many endpoints
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  return app;
}

async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT ?? 3000);
}

if (require.main === module) {
  void bootstrap();
}
