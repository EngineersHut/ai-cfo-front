import { Injectable, Logger } from "@nestjs/common";
import Anthropic from "@anthropic-ai/sdk";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private anthropic: Anthropic;

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

  private async callClaude(
    prompt: string,
    systemMessage = "You are an expert AI Chief Financial Officer (CFO).",
  ): Promise<string> {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-0",
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

  private cleanJson(text: string): string {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : text;
  }

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
    "totalExpenses": 0, // Total operating expenses
    "netCashFlow": 0, // Net income or net cash flow
    "cashBalance": 0 // Ending cash balance if available
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
      return JSON.parse(this.cleanJson(responseText));
    } catch (error) {
      this.logger.error("Failed to extract metrics using Claude", error);
      throw error;
    }
  }

  async generateConsolidatedMonthlyMetrics(
    reportsData: { name: string; content: string }[],
    industry: string,
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

CRITICAL RULES:
1. Reconcile values intelligently: For example, if Report 1 and Report 2 both show a cash balance or revenue, do not simply sum them up if they represent the same account or standard metrics. Only sum them if they are separate/non-overlapping transaction components.
2. Every field in the expected output JSON structure MUST be present.
3. If a field's value cannot be calculated or found in the reports, set its value to null. Do NOT skip any fields.
4. You MUST generate at least 3 to 4 detailed, actionable insights under "growthAnalytics.insights". Do not leave it empty.
5. Response must be ONLY a valid JSON object. No markdown formatting (do NOT wrap in \`\`\`json block), no explanation.

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
    "lineItems": [] // Array of { "category": "Revenue" | "Direct Costs" | "Operating Expenses" | "Growth & Expansion" | "Leadership & Compliance", "name": "Item name", "amount": number }
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
      console.log("responseText", responseText);
      return JSON.parse(this.cleanJson(responseText));
    } catch (error) {
      this.logger.error(
        "Failed to generate consolidated monthly metrics using Claude",
        error,
      );
      throw error;
    }
  }
}
