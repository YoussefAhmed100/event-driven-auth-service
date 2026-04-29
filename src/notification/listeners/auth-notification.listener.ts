import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationFactory } from '../factories/notification.factory';
import { AUTH_EVENTS } from 'src/events/user.events';
import { UserEvent } from 'src/events/user-created.event';

@Injectable()
export class AuthNotificationListener {

  constructor(
    private readonly notificationFactory: NotificationFactory,
  ) {}

  @OnEvent(AUTH_EVENTS.USER_LOGGED_IN)
  async handleUserLogin(event: UserEvent) {

    const { email, fullName } = event;

    // choose notification type
    const notification = this.notificationFactory.create('email');

    await notification.send(
      email,
      `Welcome back ${fullName}`
    );
  }
}