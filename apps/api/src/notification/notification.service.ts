import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  private readonly MAX_NOTIFICATIONS_PER_USER = 30;

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * Create a notification and emit it to the user in real-time
   */
  async createNotification(userId: string, title: string, message: string, type: string = 'INFO', metaData: any = {}) {
    const newNotification = new this.notificationModel({
      userId,
      title,
      message,
      type,
      metaData
    });
    
    const saved = await newNotification.save();

    // Broadcast to user via WebSockets
    this.notificationGateway.sendNotificationToUser(userId, saved);

    // Maintain max limit per user
    await this.maintainLimit(userId);

    return saved;
  }

  /**
   * Get all notifications for a user
   */
  async getNotifications(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(this.MAX_NOTIFICATIONS_PER_USER)
      .exec();
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    ).exec();
  }

  /**
   * Clear all notifications for user
   */
  async clearAll(userId: string) {
    return this.notificationModel.deleteMany({ userId }).exec();
  }

  /**
   * Delete older notifications to keep exactly max 30
   */
  private async maintainLimit(userId: string) {
    const notifications = await this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .select('_id')
      .exec();

    if (notifications.length > this.MAX_NOTIFICATIONS_PER_USER) {
      const idsToDelete = notifications
        .slice(this.MAX_NOTIFICATIONS_PER_USER)
        .map(n => n._id);

      await this.notificationModel.deleteMany({
        _id: { $in: idsToDelete }
      });
    }
  }
}
