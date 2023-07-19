import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { envSchema } from './config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthenticationModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
