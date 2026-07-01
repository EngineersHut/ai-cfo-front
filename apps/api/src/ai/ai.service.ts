import { Injectable, Logger } from "@nestjs/common";
import Anthropic from "@anthropic-ai/sdk";
import { jsonrepair } from "jsonrepair";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private anthropic: Anthropic;

  // || ---------------------- Initialize Anthropic Client Constructor ---------------------|| //
  constructor() {
    const apiKey =
      process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || "";
    if (!apiKey) {
      this.logger.warn(
        "CLAUDE_API_KEY / ANTHROPIC_API_KEY is missing in .env file. AI features will not work.",
      );
    }
    this.anthropic = new Anthropic({
      apiKey: apiKey,
    });
  }

  // || ---------------------- Call Claude LLM API Helper Function ---------------------|| //
  private async callClaude(
    prompt: string,
    systemMessage = "You are an expert AI Chief Financial Officer (CFO).",
  ): Promise<string> {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: systemMessage,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Handle message text block type check cleanly
      const contentBlock = response.content[0];
      if (contentBlock.type === "text") {
        return contentBlock.text;
      }
      throw new Error("Unexpected content block type received from Claude");
    } catch (error) {
      this.logger.error("Failed to fetch response from Claude", error);
      throw error;
    }
  }

  // || ---------------------- Clean and Extract JSON String Helper Function ---------------------|| //
  private cleanJson(text: string): string {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : text;
  }

  // || ---------------------- Extract Financial Metrics from Single Report ---------------------|| //
  async extractMetricsFromReport(
    csvContent: string,
    industry: string,
  ): Promise<any> {
    try {
      const prompt = `
I am providing you with the raw text/CSV content of a company's financial and operational report.
The company operates in the ${industry} industry.

Your task:
Analyze the data and extract the key metrics into the EXACT JSON structure shown below.
Respond ONLY with a valid JSON object, no markdown formatting (do NOT use \`\`\`json block), no explanations.

EXPECTED JSON SCHEMA:
{
  "summary": {
    "revenue": 0, // Total revenue for the period
    "cogs": 0, // Cost of Goods Sold
    "grossProfit": 0, // Gross profit
    "totalExpenses": 0, // Total operating expenses
    "netProfit": 0, // Net profit for the period
    "ebitda": 0, // EBITDA for the period
    "netCashFlow": 0, // Net income or net cash flow
    "cashBalance": 0, // Ending cash balance if available
    "netProfitMarginPercent": 0, // Net profit margin percentage
    "grossMarginPercent": 0 // Gross margin percentage
  },
  "fleet": { // Extract only if industry is FLEET_MANAGEMENT or fleet data is present
    "totalVehicles": 0,
    "activeVehicles": 0,
    "inactiveVehicles": 0,
    "fuelCost": 0,
    "maintenanceCost": 0,
    "totalTrips": 0,
    "completedTrips": 0,
    "onTimePercent": 0
  },
  "growth": {
    "clientCount": 0,
    "newClients": 0,
    "churnedClients": 0,
    "churnRate": 0
  },
  "aiInsights": [
    {
      "type": "neutral",
      "title": "Insight Title",
      "description": "Insight description explaining trends, performance or key notes from the document content."
    }
  ]
}

Rules:
- If a specific metric is not explicitly found, set its value to 0.
- For fleet metrics, if this is not a fleet company or data isn't there, leave the fleet object with 0s.
- Clean all numbers (remove currency symbols, commas). Return pure numbers.
- You MUST generate at least 3 to 4 detailed, report-specific insights under the "aiInsights" field based on the report contents. Do not leave it empty.
- Avoid any markdown wrappers. Response must be purely valid JSON.

Here is the report data:
=================
${csvContent}
=================
      `;

      const responseText = await this.callClaude(prompt);
      this.logger.log("Successfully extracted metrics using Claude API");
      try {
        return JSON.parse(jsonrepair(this.cleanJson(responseText)));
      } catch (parseError) {
        this.logger.error("Failed to parse Claude output", parseError);
        throw parseError;
      }
    } catch (error) {
      this.logger.error("Failed to extract metrics using Claude", error);
      throw error;
    }
  }

  // || ---------------------- Generate Consolidated Monthly Metrics from Multiple Reports ---------------------|| //
  async generateConsolidatedMonthlyMetrics(
    reportsData: { name: string; content: string }[],
    industry: string,
    targetMonthName: string = "the specified month",
    targetYear: number = new Date().getFullYear()
  ): Promise<any> {
    try {
      const reportsFormatted = reportsData
        .map((r, i) => `--- REPORT #${i + 1} (${r.name}) ---\n${r.content}\n`)
        .join("\n");

      const prompt = `
I am providing you with the contents of multiple financial or operational reports uploaded for a company in a single month.
The company operates in the ${industry} industry.

Your task:
Analyze all the provided reports, reconcile the metrics to avoid double-counting or conflicts, and generate a single unified set of monthly metrics according to the exact schema details below.

CRITICAL INSTRUCTIONS FOR MULTI-MONTH REPORTS:
You must extract the metrics SPECIFICALLY FOR THE MONTH OF **${targetMonthName} ${targetYear}**. 
If the reports provide a breakdown by month, locate and extract only the data for ${targetMonthName} ${targetYear}. 
If the reports only provide totals for a longer period (e.g., Q1, Yearly) and do not break it down by month, you MUST distribute the values for this specific month (for example, by dividing a quarterly total by 3, or a yearly total by 12) so the data reflects just this single month.

CRITICAL RULES:
1. Reconcile values intelligently: For example, if Report 1 and Report 2 both show a cash balance or revenue, do not simply sum them up if they represent the same account or standard metrics. Only sum them if they are separate/non-overlapping transaction components.
2. Every field in the expected output JSON structure MUST be present.
3. If a field's value cannot be calculated or found in the reports, set its value to null. Do NOT skip any fields.
4. You MUST generate at least 3 to 4 detailed, actionable insights under "growthAnalytics.insights". Do not leave it empty.
5. Response must be ONLY a valid JSON object. No markdown formatting (do NOT wrap in \`\`\`json block), no explanation.
6. For budgetPlanning.lineItems, limit to the top 15 most significant items to prevent excessive response length.

EXPECTED JSON SCHEMA:
{
  "dashboardSummary": {
    "revenue": null, // Total revenue for the month (number or null)
    "grossProfit": null, // Gross profit (number or null)
    "netProfit": null, // Net profit (number or null)
    "ebitda": null, // EBITDA (number or null)
    "totalExpenses": null, // Total expenses (number or null)
    "cashBalance": null, // Cash balance at the end of the month (number or null)
    "cashInflow": null, // Total cash inflow (number or null)
    "cashOutflow": null, // Total cash outflow (number or null)
    "netCashFlow": null, // Net cash flow (number or null)
    "grossMarginPercent": null, // Gross margin percentage (number or null)
    "netProfitMarginPercent": null, // Net profit margin percentage (number or null)
    "ebitdaMarginPercent": null, // EBITDA margin percentage (number or null)
    "expenseBreakdown": [], // Array of { "name": string, "value": number, "percentage": number, "tags": string, "note": string }
    "financialHealthScore": null, // Calculated health score 0-100 (number or null)
    "auditCompliance": null, // Audit compliance score 0-100 (number or null)
    "growthPercent": null, // Revenue growth rate compared to prior periods 0-100 (number or null)
    "equityHealth": null // Equity health score 0-100 (number or null)
  },
  "growthAnalytics": {
    "clientCount": null, // Total clients (number or null)
    "newClients": null, // New clients gained (number or null)
    "employeeCount": null, // Total employee count (number or null)
    "monthlyGrowthPercent": null, // Monthly growth % (number or null)
    "quarterlyGrowthPercent": null, // Quarterly growth % (number or null)
    "yearlyGrowthPercent": null, // Yearly growth % (number or null)
    "revenuePerClient": null, // Revenue per client (number or null)
    "revenuePerEmployee": null, // Revenue per employee (number or null)
    "employeeGrowthPercent": null, // Employee growth % (number or null)
    "clientGrowthPercent": null, // Client growth % (number or null)
    "growthHealthScore": null, // Growth health score 0-100 (number or null)
    "revenueGrowthScore": null, // Revenue growth score 0-100 (number or null)
    "clientRetentionScore": null, // Client retention score 0-100 (number or null)
    "scalingEfficiencyScore": null, // Scaling efficiency score 0-100 (number or null)
    "growthTrend": [], // Array of items: { "month": "Jan", "monthlyGrowthPercent": null, "revenueGrowthPercent": null, "clientGrowthPercent": null }
    "insights": [] // Array of items: { "title": "Insight title", "description": "Insight description" }
  },
  "fleetAnalytics": {
    "totalVehicles": null, // Total fleet vehicles (number or null)
    "activeVehicles": null, // Active vehicles (number or null)
    "inactiveVehicles": null, // Inactive vehicles (number or null)
    "fleetUtilizationPercent": null, // Fleet utilization % (number or null)
    "totalTrips": null, // Total trips (number or null)
    "completedTrips": null, // Completed trips (number or null)
    "cancelledTrips": null, // Cancelled trips (number or null)
    "fuelCost": null, // Fuel cost (number or null)
    "maintenanceCost": null, // Maintenance cost (number or null)
    "costPerTrip": null, // Average cost per trip (number or null)
    "costPerKm": null, // Average cost per km (number or null)
    "totalDeliveries": null, // Total deliveries (number or null)
    "onTimeDeliveries": null, // On-time deliveries (number or null)
    "onTimePercent": null, // On-time percentage (number or null)
    "driverEfficiencyOverall": null, // Driver efficiency overall 0-100 (number or null)
    "costEfficiency": null // Cost efficiency score 0-100 based on operational costs (number or null)
  },
  "budgetPlanning": {
    "totalRevenueBudget": null, // Total revenue budget expected (number or null)
    "totalDirectCostsBudget": null, // Total direct costs budget expected (number or null)
    "totalOperatingExpensesBudget": null, // Total operating expenses budget expected (number or null)
    "lineItems": [] // Array of { "category": "Revenue" | "Direct Costs" | "Operating Expenses" | "Growth & Expansion" | "Leadership & Compliance", "name": "Item name", "amount": number } (Limit to top 15 items)
  }
}

Here are the reports data for the month:
=================
${reportsFormatted}
=================
      `;

      const responseText = await this.callClaude(prompt);
      this.logger.log(
        "Successfully generated consolidated monthly metrics using Claude API",
      );
      try {
        return JSON.parse(jsonrepair(this.cleanJson(responseText)));
      } catch (parseError) {
        this.logger.error("Failed to parse Claude output", parseError);
        console.log("responseText was:", responseText);
        throw parseError;
      }
    } catch (error) {
      console.log(error);

      this.logger.error(
        "Failed to generate consolidated monthly metrics using Claude",
        error,
      );
      throw error;
    }
  }

  // || ---------------------- Generate Consolidated Monthly Metrics for a Whole Year ---------------------|| //
  async generateYearConsolidatedMonthlyMetrics(
    reportContent: string,
    industry: string,
    reportName?: string,
    targetYear?: number,
    periodStartDate?: string,
    periodEndDate?: string,
  ): Promise<any> {
    try {
      let periodInstruction = "";
      if (periodStartDate && periodEndDate) {
        periodInstruction = `\nCRITICAL RESTRICTION: You MUST ONLY extract data for the exact period between ${periodStartDate} and ${periodEndDate}. Absolutely IGNORE any data that falls outside this date range.`;
      } else if (targetYear) {
        periodInstruction = `\nCRITICAL RESTRICTION: You MUST ONLY extract data for the year ${targetYear}. Absolutely IGNORE any data for other years (e.g., ${targetYear + 1} or ${targetYear - 1}). If a month's data belongs to another year, do not include it.`;
      }

      const prompt = `
I am providing you with the contents of a company's financial/operational report that covers the data for an entire year (or multiple months of the year).
The company operates in the ${industry} industry.
${reportName ? `Report Name: ${reportName}\n` : ""}${periodInstruction}

Your task:
Analyze the report and extract:
1. A single consolidated yearly summary for the entire report period.
2. A month-by-month breakdown of the key metrics for each month present in the report.

CRITICAL RULES:
1. Reconcile values intelligently: For each month, extract the specific monthly figures (revenue, expenses, profits, operational metrics).
2. Ensure the response is ONLY a valid JSON object. No markdown formatting (do NOT wrap in \`\`\`json block), no explanation.
3. Every field in the expected output JSON structure MUST be present. If a field's value cannot be calculated or found, set its value to null.

EXPECTED JSON SCHEMA:
{
  "yearlySummary": {
    "revenue": null, // Total revenue for the entire year/period
    "grossProfit": null,
    "netProfit": null,
    "ebitda": null,
    "totalExpenses": null,
    "cashBalance": null, // Ending cash balance of the year/period
    "grossMarginPercent": null,
    "netProfitMarginPercent": null,
    "financialHealthScore": null,
    "insights": [] // Array of report-wide/yearly insights: { "title": "Insight Title", "description": "Insight description" }
  },
  "months": [
    // Array of monthly consolidated objects, one for each month found in the report
    {
      "month": 1, // Month number (1-12)
      "year": 2026, // Year number
      "dashboardSummary": {
        "revenue": null, // Total revenue for this month
        "grossProfit": null,
        "netProfit": null,
        "ebitda": null,
        "totalExpenses": null,
        "cashBalance": null,
        "cashInflow": null,
        "cashOutflow": null,
        "netCashFlow": null,
        "grossMarginPercent": null,
        "netProfitMarginPercent": null,
        "ebitdaMarginPercent": null,
        "expenseBreakdown": [], // Array of { "name": string, "value": number, "percentage": number, "tags": string, "note": string }
        "financialHealthScore": null,
        "auditCompliance": null,
        "growthPercent": null,
        "equityHealth": null
      },
      "growthAnalytics": {
        "clientCount": null,
        "newClients": null,
        "employeeCount": null,
        "monthlyGrowthPercent": null,
        "revenuePerClient": null,
        "revenuePerEmployee": null,
        "scalingEfficiencyScore": null
      },
      "fleetAnalytics": { // Populate only if industry is FLEET_MANAGEMENT or fleet data is present
        "totalVehicles": null,
        "activeVehicles": null,
        "inactiveVehicles": null,
        "totalTrips": null,
        "completedTrips": null,
        "fuelCost": null,
        "maintenanceCost": null,
        "onTimePercent": null
      }
    }
  ]
}

Here is the yearly report data:
=================
${reportContent}
=================
`;

      const responseText = await this.callClaude(prompt);
      this.logger.log(
        "Successfully generated year consolidated monthly metrics response using Claude API",
      );

      const cleanedResponse = this.cleanJson(responseText);
      const repairedResponse = jsonrepair(cleanedResponse);
      const parsedJson = JSON.parse(repairedResponse);

      // Console log the response as requested
      console.log("=== YEAR CONSOLIDATED MONTHLY METRICS RESPONSE ===");
      console.dir(parsedJson, { depth: null, colors: true });
      console.log("=================================================");

      return parsedJson;
    } catch (error) {
      this.logger.error(
        "Failed to generate year consolidated monthly metrics",
        error,
      );
      throw error;
    }
  }

  // || ---------------------- Generate Consolidated Multi-Month Metrics ---------------------|| //
  async generateConsolidatedMultiMonthMetrics(
    reportsData: { name: string; content: string }[],
    industry: string,
    targetMonths: { month: number; year: number }[]
  ): Promise<any> {
    try {
      const reportsFormatted = reportsData
        .map((r, i) => `--- REPORT #${i + 1} (${r.name}) ---\n${r.content}\n`)
        .join("\n");

      const monthsList = targetMonths.map(m => {
        const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${MONTH_NAMES[m.month - 1]} ${m.year}`;
      }).join(", ");

      const prompt = `
I am providing you with the contents of multiple financial or operational reports uploaded for a company.
The company operates in the ${industry} industry.

Your task:
Analyze all the provided reports, reconcile the metrics to avoid double-counting or conflicts, and generate a unified set of monthly metrics for the following specific months:
**${monthsList}**

CRITICAL INSTRUCTIONS FOR MULTI-MONTH REPORTS:
You must extract or distribute the data for EVERY SINGLE MONTH listed above. 
If the reports provide a breakdown by month, locate and extract the data for each month. 
If the reports only provide totals for a longer period (e.g., Q1, Yearly) and do not break it down by month, you MUST distribute the values evenly across the months in this period (for example, by dividing a quarterly total by 3, or a yearly total by 12) so that each month gets its proportional share.

CRITICAL RULES:
1. Reconcile values intelligently: For example, if Report 1 and Report 2 both show a cash balance or revenue, do not simply sum them up if they represent the same account or standard metrics. Only sum them if they are separate/non-overlapping transaction components.
2. Every field in the expected output JSON structure MUST be present for EACH month.
3. If a field's value cannot be calculated or found, set its value to null. Do NOT skip any fields.
4. Response must be ONLY a valid JSON object. No markdown formatting (do NOT wrap in \`\`\`json block), no explanation.

EXPECTED JSON SCHEMA:
{
  "monthlyData": [
    {
      "month": 1, // Number representing the month (1 for January, 12 for December)
      "year": 2026,
      "dashboardSummary": {
        "revenue": null, "grossProfit": null, "netProfit": null, "ebitda": null, "totalExpenses": null, "cashBalance": null, "cashInflow": null, "cashOutflow": null, "netCashFlow": null, "grossMarginPercent": null, "netProfitMarginPercent": null, "ebitdaMarginPercent": null, "expenseBreakdown": [], "financialHealthScore": null, "auditCompliance": null, "growthPercent": null, "equityHealth": null
      },
      "growthAnalytics": {
        "clientCount": null, "newClients": null, "employeeCount": null, "monthlyGrowthPercent": null, "quarterlyGrowthPercent": null, "yearlyGrowthPercent": null, "revenuePerClient": null, "revenuePerEmployee": null, "employeeGrowthPercent": null, "clientGrowthPercent": null, "growthHealthScore": null, "revenueGrowthScore": null, "clientRetentionScore": null, "scalingEfficiencyScore": null, "growthTrend": [], "insights": []
      },
      "fleetAnalytics": {
        "totalVehicles": null, "activeVehicles": null, "inactiveVehicles": null, "fleetUtilizationPercent": null, "totalTrips": null, "completedTrips": null, "cancelledTrips": null, "fuelCost": null, "maintenanceCost": null, "costPerTrip": null, "costPerKm": null, "totalDeliveries": null, "onTimeDeliveries": null, "onTimePercent": null, "driverEfficiencyOverall": null, "costEfficiency": null
      },
      "budgetPlanning": {
        "totalRevenueBudget": null, "totalDirectCostsBudget": null, "totalOperatingExpensesBudget": null, "lineItems": []
      }
    }
    // ... Repeat exactly this structure for EVERY month requested in the list
  ]
}

Here are the reports data:
=================
${reportsFormatted}
=================
      `;

      const responseText = await this.callClaude(prompt);
      this.logger.log(
        "Successfully generated batch multi-month metrics using Claude API",
      );
      try {
        return JSON.parse(jsonrepair(this.cleanJson(responseText)));
      } catch (parseError) {
        this.logger.error("Failed to parse Claude output", parseError);
        console.log("responseText was:", responseText);
        throw parseError;
      }
    } catch (error) {
      this.logger.error("Failed to consolidate reports with Claude", error);
      throw error;
    }
  }
}
