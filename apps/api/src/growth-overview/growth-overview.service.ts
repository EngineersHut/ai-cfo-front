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


    const allGrowthData = await this.growthModel
      .find({ companyId })
      .sort({ year: -1, month: -1 })
      .exec();

    const { month, year, period, quarter } = queryDto;
    const targetYear = year || (allGrowthData[0]?.year as number) || new Date().getFullYear();
    const targetMonth = month || (allGrowthData[0]?.month as number) || new Date().getMonth() + 1;

    let currentMonths: number[] = [];
    let prevMonths: number[] = [];
    let currentYears: number[] = [];
    let prevYears: number[] = [];

    if (period === 'yearly') {
      currentMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      prevMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      currentYears = [targetYear];
      prevYears = [targetYear - 1];
    } else if (period === 'quarterly') {
      const q = quarter || Math.ceil((new Date().getMonth() + 1) / 3);
      currentMonths = [(q - 1) * 3 + 1, (q - 1) * 3 + 2, (q - 1) * 3 + 3];
      currentYears = [targetYear];

      if (q === 1) {
        prevMonths = [10, 11, 12];
        prevYears = [targetYear - 1];
      } else {
        prevMonths = [(q - 2) * 3 + 1, (q - 2) * 3 + 2, (q - 2) * 3 + 3];
        prevYears = [targetYear];
      }
    } else {
      // Monthly (default)
      currentMonths = [targetMonth];
      currentYears = [targetYear];

      if (targetMonth === 1) {
        prevMonths = [12];
        prevYears = [targetYear - 1];
      } else {
        prevMonths = [targetMonth - 1];
        prevYears = [targetYear];
      }
    }

    const currentGrowthDocs = allGrowthData.filter(d => 
      d.year !== null && d.year !== undefined && currentYears.includes(d.year) &&
      d.month !== null && d.month !== undefined && currentMonths.includes(d.month)
    );
    const previousGrowthDocs = allGrowthData.filter(d => 
      d.year !== null && d.year !== undefined && prevYears.includes(d.year) &&
      d.month !== null && d.month !== undefined && prevMonths.includes(d.month)
    );

    const round2 = (val: number | null | undefined) =>
      val != null ? parseFloat(Number(val).toFixed(2)) : 0;

    let currentGrowth: any = {};
    let previousGrowth: any = {};
    let growthDataList: any[] = [];

    if (period === 'quarterly' || period === 'yearly') {
      if (currentGrowthDocs.length > 0) {
        let monthlyGrowthSum = 0, quarterlyGrowthSum = 0, yearlyGrowthSum = 0;
        let revenuePerClientSum = 0, revenuePerEmployeeSum = 0;
        let employeeGrowthSum = 0, clientGrowthSum = 0;
        let healthScoreSum = 0, revenueScoreSum = 0, retentionScoreSum = 0, scalingScoreSum = 0;
        const insightsList: any[] = [];
        const seenInsights = new Set();
        const trendList: any[] = [];

        for (const doc of currentGrowthDocs) {
          monthlyGrowthSum += doc.monthlyGrowthPercent || 0;
          quarterlyGrowthSum += doc.quarterlyGrowthPercent || 0;
          yearlyGrowthSum += doc.yearlyGrowthPercent || 0;
          revenuePerClientSum += doc.revenuePerClient || 0;
          revenuePerEmployeeSum += doc.revenuePerEmployee || 0;
          employeeGrowthSum += doc.employeeGrowthPercent || 0;
          clientGrowthSum += doc.clientGrowthPercent || 0;
          healthScoreSum += doc.growthHealthScore || 0;
          revenueScoreSum += doc.revenueGrowthScore || 0;
          retentionScoreSum += doc.clientRetentionScore || 0;
          scalingScoreSum += doc.scalingEfficiencyScore || 0;

          if (doc.insights && Array.isArray(doc.insights)) {
            for (const ins of doc.insights) {
              if (ins.title && !seenInsights.has(ins.title)) {
                seenInsights.add(ins.title);
                insightsList.push(ins);
              }
            }
          }

          if (doc.growthTrend && Array.isArray(doc.growthTrend)) {
            trendList.push(...doc.growthTrend);
          }
        }

        const len = currentGrowthDocs.length;
        currentGrowth = {
          monthlyGrowthPercent: round2(monthlyGrowthSum / len),
          quarterlyGrowthPercent: round2(quarterlyGrowthSum / len),
          yearlyGrowthPercent: round2(yearlyGrowthSum / len),
          revenuePerClient: round2(revenuePerClientSum / len),
          revenuePerEmployee: round2(revenuePerEmployeeSum / len),
          employeeGrowthPercent: round2(employeeGrowthSum / len),
          clientGrowthPercent: round2(clientGrowthSum / len),
          growthHealthScore: round2(healthScoreSum / len),
          revenueGrowthScore: round2(revenueScoreSum / len),
          clientRetentionScore: round2(retentionScoreSum / len),
          scalingEfficiencyScore: round2(scalingScoreSum / len),
          insights: insightsList,
          growthTrend: trendList,
        };
      }

      if (previousGrowthDocs.length > 0) {
        let monthlyGrowthSum = 0, quarterlyGrowthSum = 0, yearlyGrowthSum = 0;
        let revenuePerClientSum = 0, revenuePerEmployeeSum = 0;
        let employeeGrowthSum = 0, clientGrowthSum = 0;
        let healthScoreSum = 0, revenueScoreSum = 0, retentionScoreSum = 0, scalingScoreSum = 0;

        for (const doc of previousGrowthDocs) {
          monthlyGrowthSum += doc.monthlyGrowthPercent || 0;
          quarterlyGrowthSum += doc.quarterlyGrowthPercent || 0;
          yearlyGrowthSum += doc.yearlyGrowthPercent || 0;
          revenuePerClientSum += doc.revenuePerClient || 0;
          revenuePerEmployeeSum += doc.revenuePerEmployee || 0;
          employeeGrowthSum += doc.employeeGrowthPercent || 0;
          clientGrowthSum += doc.clientGrowthPercent || 0;
          healthScoreSum += doc.growthHealthScore || 0;
          revenueScoreSum += doc.revenueGrowthScore || 0;
          retentionScoreSum += doc.clientRetentionScore || 0;
          scalingScoreSum += doc.scalingEfficiencyScore || 0;
        }

        const prevLen = previousGrowthDocs.length;
        previousGrowth = {
          monthlyGrowthPercent: round2(monthlyGrowthSum / prevLen),
          quarterlyGrowthPercent: round2(quarterlyGrowthSum / prevLen),
          yearlyGrowthPercent: round2(yearlyGrowthSum / prevLen),
          revenuePerClient: round2(revenuePerClientSum / prevLen),
          revenuePerEmployee: round2(revenuePerEmployeeSum / prevLen),
          employeeGrowthPercent: round2(employeeGrowthSum / prevLen),
          clientGrowthPercent: round2(clientGrowthSum / prevLen),
          growthHealthScore: round2(healthScoreSum / prevLen),
          revenueGrowthScore: round2(revenueScoreSum / prevLen),
          clientRetentionScore: round2(retentionScoreSum / prevLen),
          scalingEfficiencyScore: round2(scalingScoreSum / prevLen),
        };
      }
    } else {
      // Monthly (default)
      const trendQuery: any = { companyId };
      if (year && month) {
        trendQuery.$or = [
          { year: { $lt: year } },
          { year: year, month: { $lte: month } },
        ];
      }
      growthDataList = await this.growthModel
        .find(trendQuery)
        .sort({ year: -1, month: -1 })
        .limit(12)
        .exec();

      currentGrowth = growthDataList[0] || ({} as any);
      previousGrowth = growthDataList[1] || ({} as any);
    }

    const summary = {
      monthlyGrowthPercent: round2(currentGrowth.monthlyGrowthPercent),
      quarterlyGrowthPercent: round2(currentGrowth.quarterlyGrowthPercent),
      yearlyGrowthPercent: round2(currentGrowth.yearlyGrowthPercent),
      revenuePerClient: round2(currentGrowth.revenuePerClient),
      revenuePerEmployee: round2(currentGrowth.revenuePerEmployee),
      employeeGrowthPercent: round2(currentGrowth.employeeGrowthPercent),
      clientGrowthPercent: round2(currentGrowth.clientGrowthPercent),
      growthHealthScore: round2(currentGrowth.growthHealthScore),
      revenueGrowthScore: round2(currentGrowth.revenueGrowthScore),
      clientRetentionScore: round2(currentGrowth.clientRetentionScore),
      scalingEfficiencyScore: round2(currentGrowth.scalingEfficiencyScore),
    };

    let combinedTrend: any[] = [];
    if (currentGrowth.growthTrend && currentGrowth.growthTrend.length > 0) {
      combinedTrend = currentGrowth.growthTrend.map((t: any) => ({
        month: t.month || "Month",
        client: round2(t.clientGrowthPercent),
        monthly: round2(t.monthlyGrowthPercent),
        revenue: round2(t.revenueGrowthPercent),
        target: 8,
      }));
    } else {
      // Build trend from historical records
      const items = (period === 'quarterly' || period === 'yearly') ? currentGrowthDocs : growthDataList;
      combinedTrend = [...items].reverse().map((curr: any) => {
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
          client: round2(curr.clientGrowthPercent),
          monthly: round2(curr.monthlyGrowthPercent),
          revenue: round2(curr.revenueGrowthScore), // Using score as fallback if revenueGrowthPercent not direct
          target: 8,
        };
      });
    }

    let combinedInsights: any[] = currentGrowth.insights || [];

    const prevSummary = {
      monthlyGrowthPercent: round2(previousGrowth.monthlyGrowthPercent),
      quarterlyGrowthPercent: round2(previousGrowth.quarterlyGrowthPercent),
      yearlyGrowthPercent: round2(previousGrowth.yearlyGrowthPercent),
      revenuePerClient: round2(previousGrowth.revenuePerClient),
      revenuePerEmployee: round2(previousGrowth.revenuePerEmployee),
      employeeGrowthPercent: round2(previousGrowth.employeeGrowthPercent),
      clientGrowthPercent: round2(previousGrowth.clientGrowthPercent),
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

