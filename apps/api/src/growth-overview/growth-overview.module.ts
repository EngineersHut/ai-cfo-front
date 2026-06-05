import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrowthOverviewController } from './growth-overview.controller';
import { GrowthOverviewService } from './growth-overview.service';
import { CompanyModule } from '../company/company.module';
import { GrowthAnalytics, GrowthAnalyticsSchema } from '../schemas/growth-analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GrowthAnalytics.name, schema: GrowthAnalyticsSchema }
    ]),
    CompanyModule,
  ],
  controllers: [GrowthOverviewController],
  providers: [GrowthOverviewService],
  exports: [GrowthOverviewService],
})
export class GrowthOverviewModule {}
