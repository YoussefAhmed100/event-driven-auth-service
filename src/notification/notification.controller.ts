import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { buildQueryDto } from 'src/common/dto/base-query.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getMyNotifications( @CurrentUser('_id') userId: string ,@Query() query: buildQueryDto) {
    return this.notificationsService.getUserNotifications(userId,query);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  // mark واحدة كـ read
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  // mark كل الـ notifications كـ read
  @Patch('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Post('send')
  sendToUser(@Body() body: { userId: string; title: string; message: string } ) {
    return this.notificationsService.sendToUser(
      body.userId,
      body.title,
      body.message,
    );
  }

  @Post('broadcast')
  broadcast(@Body() body: { title: string; message: string }) {
    return this.notificationsService.broadcast(body.title, body.message);
  }
}