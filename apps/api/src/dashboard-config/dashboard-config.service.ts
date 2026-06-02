import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DashboardConfig } from '../schemas/dashboard-config.schema';
import { UpdateDashboardConfigDto } from './dto/update-dashboard-config.dto';
import { ResponseHelper } from '../common/helpers/response.helper';

@Injectable()
export class DashboardConfigService {
  constructor(
    @InjectModel(DashboardConfig.name) private configModel: Model<DashboardConfig>
  ) {}

  // || ---------------------- Get Dashboard Config function ---------------------|| //
  async getConfig(userId: string) {
    let config = await this.configModel.findOne({ userId });
    
    if (!config) {
      config = await this.configModel.create({ userId });
    }
    
    return ResponseHelper.success('Dashboard config fetched successfully', config);
  }

  // || ---------------------- Update Dashboard Config function ---------------------|| //
  async updateConfig(userId: string, updateDto: UpdateDashboardConfigDto) {
    const config = await this.configModel.findOneAndUpdate(
      { userId },
      { $set: updateDto },
      { new: true, upsert: true }
    );
    
    return ResponseHelper.success('Dashboard config updated successfully', config);
  }
}
