import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationSettings, NotificationSettingsDocument } from '../schemas/notification-settings.schema';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectModel(NotificationSettings.name)
    private readonly notificationSettingsModel: Model<NotificationSettingsDocument>,
  ) {}

  // || ---------------------- Get/Initialize Notification Settings ---------------------|| //
  async findOneOrInitialize(userId: string): Promise<NotificationSettingsDocument> {
    let settings = await this.notificationSettingsModel
      .findOne({ userId, deletedAt: null })
      .exec();

    if (!settings) {
      settings = new this.notificationSettingsModel({
        userId,
        emailNotifications: true,
        alertsForFinancialRisks: true,
        weeklySummaryReports: true,
      });
      await settings.save();
    }

    return settings;
  }

  // || ---------------------- Update Notification Settings ---------------------|| //
  async update(
    userId: string,
    updateDto: UpdateNotificationSettingsDto,
  ): Promise<NotificationSettingsDocument> {
    // Ensure that settings exist first (initialize if not exist)
    await this.findOneOrInitialize(userId);

    const updatedSettings = await this.notificationSettingsModel
      .findOneAndUpdate(
        { userId, deletedAt: null },
        { $set: updateDto },
        { new: true },
      )
      .exec();

    return updatedSettings!;
  }
}
