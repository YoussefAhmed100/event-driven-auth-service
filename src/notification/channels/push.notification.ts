import { Injectable } from '@nestjs/common';
import { INotification } from '../interfaces/notification.interface';

@Injectable()
export class PushNotification implements INotification {

  async send(email: string, message: string) {
    console.log(`📱 Push notification sent to ${email}: ${message}`);
  }
}