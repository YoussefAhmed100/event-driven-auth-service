import { Module } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { NotificationsController } from './notification.controller';
import { AuthNotificationListener } from './listeners/auth-notification.listener';
import { PushNotification } from './channels/push.notification';
import { EmailNotification } from './channels/email.notification';
import { NotificationFactory } from './factories/notification.factory';

@Module({
  imports: [],
  providers: [
    NotificationsService,
    NotificationFactory,
    EmailNotification,
    PushNotification,
    AuthNotificationListener,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationModule {}
