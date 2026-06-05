import { Injectable, Logger } from "@nestjs/common";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey =
      process.env.GEMINI_API_KEY || "AIzaSyBgsQSV5cuhR_s_dMjuU61MmcE2afINemk";
    if (!apiKey) {
      this.logger.warn(
        "GEMINI_API_KEY is missing in .env file. AI features will not work.",
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async extractMetricsFromReport(
    csvContent: string,
    industry: string,
  ): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const prompt = `
You are an expert AI Chief Financial Officer (CFO).
I am providing you with the raw text/CSV content of a company's financial and operational report.
The company operates in the ${industry} industry.

Your task:
Analyze the data and extract the key metrics into the EXACT JSON structure shown below.
Respond ONLY with a valid JSON object, no markdown formatting, no explanations.

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
  }
}

Rules:
- If a specific metric is not explicitly found, set its value to 0.
- For fleet metrics, if this is not a fleet company or data isn't there, leave the fleet object with 0s.
- Clean all numbers (remove currency symbols, commas). Return pure numbers.

Here is the report data:
=================
${csvContent}
=================
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      this.logger.log("Successfully extracted metrics using Gemini API");
      this.logger.log(`Raw Gemini Response: \n${responseText}`);

      return JSON.parse(responseText);
    } catch (error) {
      this.logger.error("Failed to extract metrics using Gemini", error);
      throw error;
    }
  }
}
