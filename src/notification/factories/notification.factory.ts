import { Injectable } from '@nestjs/common';
import { EmailNotification } from '../channels/email.notification';
import { PushNotification } from '../channels/push.notification';
import { INotification } from '../interfaces/notification.interface';

@Injectable()
export class NotificationFactory {

  constructor(
    private readonly email: EmailNotification,
    private readonly push: PushNotification,
  ) {}

  create(type: 'email' | 'push'): INotification {

    switch (type) {

      case 'email':
        return this.email;

      case 'push':
        return this.push;

      default:
        throw new Error('Unsupported notification type');
    }
  }
}