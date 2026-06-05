import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CompanyService } from "../company/company.service";
import {
  GrowthAnalytics,
  GrowthAnalyticsDocument,
} from "../schemas/growth-analytics.schema";
import {
  GetGrowthOverviewDto,
  GrowthPeriodEnum,
} from "./dto/get-growth-overview.dto";

@Injectable()
export class GrowthOverviewService {
  constructor(
    private companyService: CompanyService,
    @InjectModel(GrowthAnalytics.name)
    private growthModel: Model<GrowthAnalyticsDocument>,
  ) {}

  // || ---------------------- Get Growth Overview Data function ---------------------|| //
  async getGrowthOverview(company: any, queryDto: GetGrowthOverviewDto) {
    const { period } = queryDto;
    const companyId = company._id.toString();

    const typeQuery = {
      companyId,
      periodType: period.toLowerCase(),
    };

    const growthDataList = await this.growthModel
      .find(typeQuery)
      .sort({ periodStartDate: -1 })
      .limit(12)
      .exec();

    const currentGrowth = growthDataList[0] || {} as any;

    const summary = {
      monthlyGrowthPercent: currentGrowth.monthlyGrowthPercent || 0,
      quarterlyGrowthPercent: currentGrowth.quarterlyGrowthPercent || 0,
      yearlyGrowthPercent: currentGrowth.yearlyGrowthPercent || 0,
      revenuePerClient: currentGrowth.revenuePerClient || 0,
      revenuePerEmployee: currentGrowth.revenuePerEmployee || 0,
      employeeGrowthPercent: currentGrowth.employeeGrowthPercent || 0,
      clientGrowthPercent: currentGrowth.clientGrowthPercent || 0,
      growthHealthScore: currentGrowth.growthHealthScore || 0,
      revenueGrowthScore: currentGrowth.revenueGrowthScore || 0,
      clientRetentionScore: currentGrowth.clientRetentionScore || 0,
      scalingEfficiencyScore: currentGrowth.scalingEfficiencyScore || 0,
    };

    let combinedTrend: any[] = [];
    if (currentGrowth.growthTrend && currentGrowth.growthTrend.length > 0) {
        combinedTrend = currentGrowth.growthTrend;
    } else {
        // Build trend from historical records
        combinedTrend = growthDataList.reverse().map((curr: any) => ({
            month: curr.periodStartDate ? curr.periodStartDate.toLocaleString("default", { month: "short" }) : "Month",
            value: curr.monthlyGrowthPercent || 0
        }));
    }

    let combinedInsights: any[] = currentGrowth.insights || [];

    const round2 = (val: number | null | undefined) =>
      val != null ? parseFloat(Number(val).toFixed(2)) : 0;

    return {
      cards: {
        monthlyGrowthPercent: round2(summary.monthlyGrowthPercent),
        quarterlyGrowthPercent: round2(summary.quarterlyGrowthPercent),
        yearlyGrowthPercent: round2(summary.yearlyGrowthPercent),
        revenuePerClient: round2(summary.revenuePerClient),
        revenuePerEmployee: round2(summary.revenuePerEmployee),
        employeeGrowthPercent: round2(summary.employeeGrowthPercent),
        clientGrowthPercent: round2(summary.clientGrowthPercent),
      },
      growthHealth: {
        growthHealthScore: round2(summary.growthHealthScore),
        revenueGrowthScore: round2(summary.revenueGrowthScore),
        clientRetentionScore: round2(summary.clientRetentionScore),
        scalingEfficiencyScore: round2(summary.scalingEfficiencyScore),
      },
      growthTrend: combinedTrend,
      insights: combinedInsights,
    };
  }
}
