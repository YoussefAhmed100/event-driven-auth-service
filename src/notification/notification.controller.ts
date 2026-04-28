import {
  Controller,

} from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { AUTH_EVENTS } from 'src/events/user.events';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


    @OnEvent( AUTH_EVENTS.USER_REGISTERED,)
  async handle(event: UserCreatedEvent) {

    console.log(`📧 Sending welcome email to ${event.email}`);

  }
  @OnEvent(AUTH_EVENTS.USER_REGISTERED)
async handleWallet(event: UserCreatedEvent) {
  console.log(`💰 Creating wallet for ${event.userId}`);
}

@OnEvent(AUTH_EVENTS.USER_REGISTERED)
handleTracking(event: UserCreatedEvent) {
  console.log(`📊 Tracking user ${event.userId}`);
}
}