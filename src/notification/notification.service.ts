import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schema/notification.schema';
import { NotificationsGateway } from './notifications.gateway';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ApiFeatures } from 'src/common/utils/api-features';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private gateway: NotificationsGateway,
  ) {}

  // بعت system notification لـ user معين
  async sendToUser(userId: string, title: string, message: string) {
    const notification = await this.notificationModel.create({
      userId: new Types.ObjectId(userId),
      title,
      message,
      type: 'system',
    });

    // real-time push
    this.gateway.sendToUser(userId, notification.toObject());

    return notification;
  }

  // بعت broadcast لكل المستخدمين
  async broadcast(title: string, message: string) {
    const notification = await this.notificationModel.create({
      userId: null,
      title,
      message,
      type: 'broadcast',
    });

    // real-time push لكل المتصلين
    this.gateway.broadcastToAll(notification.toObject());

    return notification;
  }

async getUserNotifications(userId: string, query: buildQueryDto) {
  const features = new ApiFeatures(
    this.notificationModel
      .find({
        $or: [
          { userId: new Types.ObjectId(userId) },
          { type: 'broadcast' },
        ],
      })
      .lean(),
    query,
  )
    .filter()
    .search(['message', 'type', 'title']);


    const [total, _] = await Promise.all([
    features.count(),
    Promise.resolve(),
  ]);

  features.sort().limitFields().paginate(total);

  const data = await features.exec();

  return {
    results: data.length,
    pagination: features.paginationResult,
    data,
  };
}

  // count الـ unread
  async getUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({
      $or: [
        { userId: new Types.ObjectId(userId) },
        { type: 'broadcast' },
      ],
      isRead: false,
    });
  }

  // mark as read
  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        $or: [
          { userId: new Types.ObjectId(userId) },
          { type: 'broadcast' },
        ],
      },
      { isRead: true },
      { new: true },
    );
  }

  // mark all as read
  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      {
        $or: [
          { userId: new Types.ObjectId(userId) },
          { type: 'broadcast' },
        ],
        isRead: false,
      },
      { isRead: true },
    );
  }
}