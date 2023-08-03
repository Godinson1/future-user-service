import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { UserService } from 'src/user/services/user.service';
import { UserModule } from 'src/user/user.module';
import { RmqModule } from 'future-connectors';
import { NOTIFICATION_SERVICE, PAYMENT_SERVICE } from 'src/constants';
import { AuthenticationEvents } from './events/authentication.event';

@Module({
  imports: [
    RmqModule,
    RmqModule.register({ name: NOTIFICATION_SERVICE }),
    RmqModule.register({ name: PAYMENT_SERVICE }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get('JWT_EXPIRATION')}s` },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthenticationService, UserService, LocalStrategy, JwtStrategy, AuthenticationEvents],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
