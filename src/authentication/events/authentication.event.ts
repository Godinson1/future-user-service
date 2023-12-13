import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NOTIFICATION_SERVICE, PAYMENT_SERVICE } from 'src/constants';
import { UserCreatedDto } from '../dto/auth.dto';

@Injectable()
export class AuthenticationEvents {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
  ) {}
  @OnEvent('user.created')
  async handleUserCreated(user: UserCreatedDto) {
    await lastValueFrom(this.notificationClient.emit('user.created', user));
  }

  @OnEvent('user.created')
  async handleUserCreatedPayment(user: UserCreatedDto) {
    console.log('i got here');
    await lastValueFrom(this.paymentClient.emit('user.created', user));
  }
}
