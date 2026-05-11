import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    global: true,
    signOptions: {
      algorithm: configService.get('JWT_ALGORITHM'),
    },
    secret: configService.get('JWT_SECRET'),
  }),
});

export default jwtModule;
