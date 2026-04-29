import { Controller } from '@nestjs/common';
import { NotificationsService } from './notification.service';


@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


}
