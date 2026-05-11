import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseModule from './core/configs/database.config';
import AdminModule from './features/admin/admin.module';
import AuthModule from './features/authentication/auth.module';
import FeedbackModule from './features/feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    databaseModule,
    JwtModule.register({
      global: true,
      secret: `%}c8%|/-@T8UM|>I}9?4;}OH9-}.ANN-(iJs1>,r#ZoIv8*894B_Vjnh.LM53TL>8:2@Z{-7MW0y3+KgY!4jMg`,
      signOptions: { algorithm: 'HS512' },
    }),

    // Imports all feature modules here
    AdminModule,
    AuthModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
