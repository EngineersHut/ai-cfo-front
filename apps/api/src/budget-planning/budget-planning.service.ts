import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  BudgetPlanning,
  BudgetPlanningDocument,
} from "../schemas/budget-planning.schema";
import { BudgetCategory } from "../common/enums/budget-category.enum";
import {
  DashboardSummary,
  DashboardSummaryDocument,
} from "../schemas/dashboard-summary.schema";
import { GetBudgetDto } from "./dto/get-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";

@Injectable()
export class BudgetPlanningService {
  private readonly logger = new Logger(BudgetPlanningService.name);

  constructor(
    @InjectModel(BudgetPlanning.name)
    private readonly budgetModel: Model<BudgetPlanningDocument>,
    @InjectModel(DashboardSummary.name)
    private readonly dashboardModel: Model<DashboardSummaryDocument>,
  ) {}

  async getBudgetOverview(queryDto: GetBudgetDto) {
    const { companyId, period } = queryDto;
    let resolvedMonth: number = queryDto.month ? Number(queryDto.month) : 0;
    let resolvedYear: number = queryDto.year ? Number(queryDto.year) : 0;

    const calcVariance = (actual: number, budget: number) => {
      if (budget === 0 && actual > 0) return { percent: 100, absolute: actual };
      if (budget === 0 && actual === 0) return { percent: 0, absolute: 0 };
      const diff = actual - budget;
      return {
        percent: parseFloat(((diff / budget) * 100).toFixed(2)),
        absolute: diff,
      };
    };

    const groupLineItems = (items: any[]) => {
      const categories = [
        BudgetCategory.REVENUE,
        BudgetCategory.DIRECT_COSTS,
        BudgetCategory.OPERATING_EXPENSES,
        BudgetCategory.GROWTH_EXPANSION,
        BudgetCategory.LEADERSHIP_COMPLIANCE,
      ];
      return categories.map((cat) => ({
        category: cat,
        items: items
          .filter((i) => i.category === cat)
          .map((i) => ({ name: i.name, amount: i.amount })),
      }));
    };

    if (period === "yearly") {
      if (!resolvedYear) resolvedYear = new Date().getFullYear();

      // Fetch all actuals for the year
      const dashboardData = await this.dashboardModel
        .find({ companyId, year: resolvedYear })
        .exec();

      // Fetch all budgets for the year
      const budgetPlans = await this.budgetModel
        .find({ companyId, year: resolvedYear })
        .exec();

      let actualRevenue = 0;
      let actualGrossProfit = 0;
      let actualNetProfit = 0;
      let actualTotalExpenses = 0;

      for (const d of dashboardData) {
        actualRevenue += d.revenue || 0;
        actualGrossProfit += d.grossProfit || 0;
        actualNetProfit += d.netProfit || 0;
        actualTotalExpenses += d.totalExpenses || 0;
      }

      let budgetRevenue = 0;
      let budgetDirectCosts = 0;
      let budgetOpEx = 0;
      const lineItemMap = new Map<string, any>();

      for (const b of budgetPlans) {
        budgetRevenue += b.totalRevenueBudget || 0;
        budgetDirectCosts += b.totalDirectCostsBudget || 0;
        budgetOpEx += b.totalOperatingExpensesBudget || 0;

        for (const item of b.lineItems) {
          const key = `${item.category}_${item.name}`;
          if (!lineItemMap.has(key)) {
            lineItemMap.set(key, {
              category: item.category,
              name: item.name,
              amount: 0,
            });
          }
          lineItemMap.get(key).amount += item.amount;
        }
      }

      const planningTable = Array.from(lineItemMap.values());
      const revVariance = calcVariance(actualRevenue, budgetRevenue);

      const budgetGrossProfit = budgetRevenue - budgetDirectCosts;
      const grossProfitVariance = calcVariance(
        actualGrossProfit,
        budgetGrossProfit,
      );

      const budgetNetProfit = budgetGrossProfit - budgetOpEx;
      const actualNetMargin =
        actualRevenue > 0 ? (actualNetProfit / actualRevenue) * 100 : 0;
      const budgetNetMargin =
        budgetRevenue > 0 ? (budgetNetProfit / budgetRevenue) * 100 : 0;

      let overBudgetAmount = 0;
      if (actualTotalExpenses > budgetOpEx) {
        overBudgetAmount = actualTotalExpenses - budgetOpEx;
      }

      return {
        summaryCards: {
          budgetRevenue,
          actualRevenue,
          revenueVariance: {
            percent: revVariance.percent,
            absolute: revVariance.absolute,
            isFavorable: revVariance.absolute >= 0,
          },
          overBudgetItems: overBudgetAmount,
        },
        summaryTable: {
          revenue: {
            budget: budgetRevenue,
            actual: actualRevenue,
            variancePercent: revVariance.percent,
            notes: "Total Revenue generated",
          },
          directCosts: {
            budget: budgetDirectCosts,
            actual: actualRevenue - actualGrossProfit,
            variancePercent: calcVariance(
              actualRevenue - actualGrossProfit,
              budgetDirectCosts,
            ).percent,
            notes: "Revenue - Gross Profit",
          },
          operatingExpenses: {
            budget: budgetOpEx,
            actual: actualTotalExpenses,
            variancePercent: calcVariance(actualTotalExpenses, budgetOpEx)
              .percent,
            notes: "Total Operating Expenses",
          },
          grossProfit: {
            budget: budgetGrossProfit,
            actual: actualGrossProfit,
            variancePercent: grossProfitVariance.percent,
            notes: "Revenue - Direct Costs",
          },
          netMargin: {
            budget: parseFloat(budgetNetMargin.toFixed(1)),
            actual: parseFloat(actualNetMargin.toFixed(1)),
            variancePercent: calcVariance(actualNetMargin, budgetNetMargin)
              .percent,
            notes: "(Net Profit ÷ Revenue) × 100",
          },
        },
        planningTable: groupLineItems(planningTable),
      };
    }

    // --- MONTHLY LOGIC ---
    if (!resolvedMonth || !resolvedYear) {
      const latestData = await this.dashboardModel
        .findOne({ companyId })
        .sort({ year: -1, month: -1 })
        .exec();

      if (latestData && latestData.month && latestData.year) {
        resolvedMonth = latestData.month;
        resolvedYear = latestData.year;
      } else {
        const now = new Date();
        resolvedMonth = now.getMonth() + 1;
        resolvedYear = now.getFullYear();
      }
    }

    // Fetch actuals for current and previous month
    const dashboardData = await this.dashboardModel
      .find({
        companyId,
        $or: [
          { year: { $lt: resolvedYear } },
          { year: resolvedYear, month: { $lte: resolvedMonth } },
        ],
      })
      .sort({ year: -1, month: -1 })
      .limit(2)
      .exec();

    const actualCurrent =
      dashboardData.find(
        (d) => d.month === resolvedMonth && d.year === resolvedYear,
      ) || ({} as any);
    const actualPrevious =
      dashboardData.find(
        (d) => d.month !== resolvedMonth || d.year !== resolvedYear,
      ) || ({} as any);

    let budgetPlan = await this.budgetModel
      .findOne({
        companyId,
        month: resolvedMonth,
        year: resolvedYear,
      })
      .exec();

    // SMART PRE-FILL LOGIC: If no budget plan exists, create a default template based on last month's actuals
    if (!budgetPlan) {
      this.logger.log(
        `No budget found for ${resolvedMonth}/${resolvedYear}. Generating smart pre-fill.`,
      );

      const defaultLineItems = [
        {
          category: BudgetCategory.REVENUE,
          name: "Budgeted Revenue",
          amount: actualPrevious.revenue || 0,
        },
        {
          category: BudgetCategory.DIRECT_COSTS,
          name: "COGS",
          amount:
            (actualPrevious.revenue || 0) - (actualPrevious.grossProfit || 0) ||
            0,
        },
        {
          category: BudgetCategory.OPERATING_EXPENSES,
          name: "Operating Expenditures",
          amount: actualPrevious.totalExpenses || 0,
        },
      ];

      const totalRev = defaultLineItems
        .filter((i) => i.category === BudgetCategory.REVENUE)
        .reduce((sum, i) => sum + i.amount, 0);
      const totalDirect = defaultLineItems
        .filter((i) => i.category === BudgetCategory.DIRECT_COSTS)
        .reduce((sum, i) => sum + i.amount, 0);
      const totalOpEx = defaultLineItems
        .filter((i) => i.category === BudgetCategory.OPERATING_EXPENSES)
        .reduce((sum, i) => sum + i.amount, 0);

      budgetPlan = new this.budgetModel({
        companyId,
        month: resolvedMonth,
        year: resolvedYear,
        lineItems: defaultLineItems,
        totalRevenueBudget: totalRev,
        totalDirectCostsBudget: totalDirect,
        totalOperatingExpensesBudget: totalOpEx,
      });

      await budgetPlan.save();
    }

    const revVariance = calcVariance(
      actualCurrent.revenue || 0,
      budgetPlan.totalRevenueBudget,
    );

    // Auto-computed Gross Profit and Net Margin
    const actualGrossProfit = actualCurrent.grossProfit || 0;
    const budgetGrossProfit =
      budgetPlan.totalRevenueBudget - budgetPlan.totalDirectCostsBudget;
    const grossProfitVariance = calcVariance(
      actualGrossProfit,
      budgetGrossProfit,
    );

    const actualNetProfit = actualCurrent.netProfit || 0;
    const budgetNetProfit =
      budgetGrossProfit - budgetPlan.totalOperatingExpensesBudget;

    const actualNetMargin =
      actualCurrent.revenue > 0
        ? (actualNetProfit / actualCurrent.revenue) * 100
        : 0;
    const budgetNetMargin =
      budgetPlan.totalRevenueBudget > 0
        ? (budgetNetProfit / budgetPlan.totalRevenueBudget) * 100
        : 0;

    let overBudgetAmount = 0;
    if (
      (actualCurrent.totalExpenses || 0) >
      budgetPlan.totalOperatingExpensesBudget
    ) {
      overBudgetAmount =
        (actualCurrent.totalExpenses || 0) -
        budgetPlan.totalOperatingExpensesBudget;
    }

    return {
      summaryCards: {
        budgetRevenue: budgetPlan.totalRevenueBudget,
        actualRevenue: actualCurrent.revenue || 0,
        revenueVariance: {
          percent: revVariance.percent,
          absolute: revVariance.absolute,
          isFavorable: revVariance.absolute >= 0,
        },
        overBudgetItems: overBudgetAmount,
      },
      summaryTable: {
        revenue: {
          budget: budgetPlan.totalRevenueBudget,
          actual: actualCurrent.revenue || 0,
          variancePercent: revVariance.percent,
          notes: "Total Revenue generated",
        },
        directCosts: {
          budget: budgetPlan.totalDirectCostsBudget,
          actual:
            (actualCurrent.revenue || 0) - (actualCurrent.grossProfit || 0),
          variancePercent: calcVariance(
            (actualCurrent.revenue || 0) - (actualCurrent.grossProfit || 0),
            budgetPlan.totalDirectCostsBudget,
          ).percent,
          notes: "Revenue - Gross Profit",
        },
        operatingExpenses: {
          budget: budgetPlan.totalOperatingExpensesBudget,
          actual: actualCurrent.totalExpenses || 0,
          variancePercent: calcVariance(
            actualCurrent.totalExpenses || 0,
            budgetPlan.totalOperatingExpensesBudget,
          ).percent,
          notes: "Total Operating Expenses",
        },
        grossProfit: {
          budget: budgetGrossProfit,
          actual: actualGrossProfit,
          variancePercent: grossProfitVariance.percent,
          notes: "Revenue - Direct Costs",
        },
        netMargin: {
          budget: parseFloat(budgetNetMargin.toFixed(1)),
          actual: parseFloat(actualNetMargin.toFixed(1)),
          variancePercent: calcVariance(actualNetMargin, budgetNetMargin)
            .percent,
          notes: "(Net Profit ÷ Revenue) × 100",
        },
      },
      planningTable: groupLineItems(budgetPlan.lineItems),
    };
  }

  async upsertBudget(updateDto: UpdateBudgetDto) {
    const { companyId, month, year, lineItems } = updateDto;

    const totalRevenueBudget = lineItems
      .filter((i) => i.category === BudgetCategory.REVENUE)
      .reduce((sum, i) => sum + i.amount, 0);
    const totalDirectCostsBudget = lineItems
      .filter((i) => i.category === BudgetCategory.DIRECT_COSTS)
      .reduce((sum, i) => sum + i.amount, 0);
    const totalOperatingExpensesBudget = lineItems
      .filter((i) => i.category === BudgetCategory.OPERATING_EXPENSES)
      .reduce((sum, i) => sum + i.amount, 0);

    const updatedBudget = await this.budgetModel.findOneAndUpdate(
      { companyId, month, year },
      {
        $set: {
          lineItems,
          totalRevenueBudget,
          totalDirectCostsBudget,
          totalOperatingExpensesBudget,
        },
      },
      { returnDocument: 'after', upsert: true },
    );

    return updatedBudget;
  }
}
