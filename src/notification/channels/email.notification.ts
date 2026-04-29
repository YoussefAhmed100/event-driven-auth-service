import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { INotification } from '../interfaces/notification.interface';

@Injectable()
export class EmailNotification implements INotification {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async send(email: string, message: string) {
    await this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('MAIL_USER'),
      subject: 'Notification',
      text: message,
    });
  }
}