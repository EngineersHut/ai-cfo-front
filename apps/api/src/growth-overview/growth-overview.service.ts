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

  async exportGrowthOverviewCsv(
    company: any,
    queryDto: GetGrowthOverviewDto,
  ): Promise<string> {
    if (!company) {
      return "Metric,Value,Trend\n";
    }
    const data = await this.getGrowthOverview(company, queryDto);

    const formatCurrency = (val: any) =>
      val !== undefined && val !== null ? `$${val.toLocaleString()}` : "N/A";
    const formatPercent = (val: any) =>
      val !== undefined && val !== null ? `${val}%` : "N/A";
    const formatTrend = (trend: any) => (trend ? trend : "N/A");

    const formatIndustry = (industryStr: string) => {
      if (!industryStr) return "N/A";
      return industryStr
        .replace(/[-_]/g, " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    };

    let csv = `\n`;
    csv += `"**************************************************"\n`;
    csv += `"               AI-CFO GROWTH OVERVIEW            "\n`;
    csv += `"             COMPLETE GROWTH EXPORT              "\n`;
    csv += `"**************************************************"\n`;
    csv += `\n`;
    csv += `Workspace:,${company.name || "N/A"}\n`;
    csv += `Industry:,${formatIndustry(company.industry)}\n`;
    csv += `Period:,${queryDto.month ? `${queryDto.month}/${queryDto.year}` : "Latest"}\n`;
    csv += `Generated On:,${new Date().toLocaleString()}\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 1: KPI CARDS
    csv += `"SECTION 1: KEY PERFORMANCE INDICATORS"\n`;
    csv += `Metric,Value,Trend\n`;
    const cards = data.cards || {};
    csv += `"Monthly Growth","${formatPercent(cards.monthlyGrowthPercent?.value)}","${formatTrend(cards.monthlyGrowthPercent?.trend)}"\n`;
    csv += `"Quarterly Growth","${formatPercent(cards.quarterlyGrowthPercent?.value)}","${formatTrend(cards.quarterlyGrowthPercent?.trend)}"\n`;
    csv += `"Yearly Growth","${formatPercent(cards.yearlyGrowthPercent?.value)}","${formatTrend(cards.yearlyGrowthPercent?.trend)}"\n`;
    csv += `"Revenue Per Client","${formatCurrency(cards.revenuePerClient?.value)}","${formatTrend(cards.revenuePerClient?.trend)}"\n`;
    csv += `"Revenue Per Employee","${formatCurrency(cards.revenuePerEmployee?.value)}","${formatTrend(cards.revenuePerEmployee?.trend)}"\n`;
    csv += `"Employee Growth","${formatPercent(cards.employeeGrowthPercent?.value)}","${formatTrend(cards.employeeGrowthPercent?.trend)}"\n`;
    csv += `"Client Growth","${formatPercent(cards.clientGrowthPercent?.value)}","${formatTrend(cards.clientGrowthPercent?.trend)}"\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 2: GROWTH HEALTH SCORES
    csv += `"SECTION 2: GROWTH HEALTH SCORES"\n`;
    csv += `Metric,Score\n`;
    const growthHealth = data.growthHealth || {};
    csv += `"Growth Health Score","${growthHealth.growthHealthScore || 0}/100"\n`;
    csv += `"Revenue Growth Score","${growthHealth.revenueGrowthScore || 0}/100"\n`;
    csv += `"Client Retention Score","${growthHealth.clientRetentionScore || 0}/100"\n`;
    csv += `"Scaling Efficiency Score","${growthHealth.scalingEfficiencyScore || 0}/100"\n`;
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 3: GROWTH TRENDS (12 MONTHS)
    csv += `"SECTION 3: GROWTH TRENDS (12 MONTHS)"\n`;
    csv += `Month,Client Growth (%),Monthly Growth (%),Revenue Growth Score (%),Target (%)\n`;
    const trend = data.growthTrend || [];
    for (const item of trend) {
      csv += `"${item.month}","${item.client}%","${item.monthly}%","${item.revenue}%","${item.target}%"\n`;
    }
    csv += `\n`;
    csv += `--------------------------------------------------\n`;
    csv += `\n`;

    // Section 4: GROWTH INSIGHTS
    csv += `"SECTION 4: GROWTH INSIGHTS"\n`;
    csv += `Title,Insight Description\n`;
    const insights = data.insights || [];
    for (const insight of insights) {
      csv += `"${insight.title || "Insight"}","${insight.description || ""}"\n`;
    }

    return csv;
  }
}

