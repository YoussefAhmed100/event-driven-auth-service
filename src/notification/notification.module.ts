import { Module } from '@nestjs/common';
import { AuthNotificationListener } from './listeners/auth-notification.listener';
import { PushNotification } from './channels/push.notification';
import { EmailNotification } from './channels/email.notification';
import { NotificationFactory } from './factories/notification.factory';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
   imports: [
    ConfigModule,

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'), 
            pass: configService.get('MAIL_PASS'), 
          },
        },
      }),
    }),
  ],
  providers: [
    NotificationFactory,
    EmailNotification,
    PushNotification,
    AuthNotificationListener,
  ],
  controllers: [],
  exports: [MailerModule],
})
export class NotificationModule {}
