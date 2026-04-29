import { Injectable } from '@nestjs/common';
import { INotification } from '../interfaces/notification.interface';

@Injectable()
export class EmailNotification implements INotification {

  async send(email: string, message: string) {
    console.log(`📧 Email sent to ${email}: ${message}`);
  }
}