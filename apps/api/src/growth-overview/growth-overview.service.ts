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
    if (!company) {
      return this.getEmptyOverview();
    }
    const companyId = company._id.toString();
    const { month, year } = queryDto;

    const trendQuery: any = { companyId };
    if (year && month) {
      trendQuery.$or = [
        { year: { $lt: year } },
        { year: year, month: { $lte: month } },
      ];
    }

    const growthDataList = await this.growthModel
      .find(trendQuery)
      .sort({ year: -1, month: -1 })
      .limit(12)
      .exec();

    const currentGrowth = growthDataList[0] || ({} as any);
    const previousGrowth = growthDataList[1] || ({} as any);

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
      combinedTrend = currentGrowth.growthTrend.map((t: any) => ({
        month: t.month || "Month",
        client: t.clientGrowthPercent || 0,
        monthly: t.monthlyGrowthPercent || 0,
        revenue: t.revenueGrowthPercent || 0,
        target: 8,
      }));
    } else {
      // Build trend from historical records
      combinedTrend = growthDataList.reverse().map((curr: any) => {
        let monthLabel = "Month";
        if (curr.month) {
          const date = new Date(
            curr.year || new Date().getFullYear(),
            curr.month - 1,
            1,
          );
          monthLabel = date.toLocaleString("default", { month: "short" });
        }
        return {
          month: monthLabel,
          client: curr.clientGrowthPercent || 0,
          monthly: curr.monthlyGrowthPercent || 0,
          revenue: curr.revenueGrowthScore || 0, // Using score as fallback if revenueGrowthPercent not direct
          target: 8,
        };
      });
    }

    let combinedInsights: any[] = currentGrowth.insights || [];

    const round2 = (val: number | null | undefined) =>
      val != null ? parseFloat(Number(val).toFixed(2)) : 0;

    const prevSummary = {
      monthlyGrowthPercent: previousGrowth.monthlyGrowthPercent || 0,
      quarterlyGrowthPercent: previousGrowth.quarterlyGrowthPercent || 0,
      yearlyGrowthPercent: previousGrowth.yearlyGrowthPercent || 0,
      revenuePerClient: previousGrowth.revenuePerClient || 0,
      revenuePerEmployee: previousGrowth.revenuePerEmployee || 0,
      employeeGrowthPercent: previousGrowth.employeeGrowthPercent || 0,
      clientGrowthPercent: previousGrowth.clientGrowthPercent || 0,
    };

    const getTrend = (curr: number, prev: number) => {
      if (prev === 0 && curr > 0) return "+100%";
      if (prev === 0 && curr === 0) return "Stable";
      const diff = curr - prev;
      const pct = (diff / prev) * 100;
      if (Math.abs(pct) < 0.1) return "Stable";
      return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    };

    return {
      cards: {
        monthlyGrowthPercent: {
          value: round2(summary.monthlyGrowthPercent),
          trend: getTrend(
            summary.monthlyGrowthPercent,
            prevSummary.monthlyGrowthPercent,
          ),
        },
        quarterlyGrowthPercent: {
          value: round2(summary.quarterlyGrowthPercent),
          trend: getTrend(
            summary.quarterlyGrowthPercent,
            prevSummary.quarterlyGrowthPercent,
          ),
        },
        yearlyGrowthPercent: {
          value: round2(summary.yearlyGrowthPercent),
          trend: getTrend(
            summary.yearlyGrowthPercent,
            prevSummary.yearlyGrowthPercent,
          ),
        },
        revenuePerClient: {
          value: round2(summary.revenuePerClient),
          trend: getTrend(
            summary.revenuePerClient,
            prevSummary.revenuePerClient,
          ),
        },
        revenuePerEmployee: {
          value: round2(summary.revenuePerEmployee),
          trend: getTrend(
            summary.revenuePerEmployee,
            prevSummary.revenuePerEmployee,
          ),
        },
        employeeGrowthPercent: {
          value: round2(summary.employeeGrowthPercent),
          trend: getTrend(
            summary.employeeGrowthPercent,
            prevSummary.employeeGrowthPercent,
          ),
        },
        clientGrowthPercent: {
          value: round2(summary.clientGrowthPercent),
          trend: getTrend(
            summary.clientGrowthPercent,
            prevSummary.clientGrowthPercent,
          ),
        },
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

  private getEmptyOverview() {
    return {
      cards: {
        monthlyGrowthPercent: { value: 0, trend: "Stable" },
        quarterlyGrowthPercent: { value: 0, trend: "Stable" },
        yearlyGrowthPercent: { value: 0, trend: "Stable" },
        revenuePerClient: { value: 0, trend: "Stable" },
        revenuePerEmployee: { value: 0, trend: "Stable" },
        employeeGrowthPercent: { value: 0, trend: "Stable" },
        clientGrowthPercent: { value: 0, trend: "Stable" },
      },
      growthHealth: {
        growthHealthScore: 0,
        revenueGrowthScore: 0,
        clientRetentionScore: 0,
        scalingEfficiencyScore: 0,
      },
      growthTrend: [],
      insights: [],
    };
  }
}
