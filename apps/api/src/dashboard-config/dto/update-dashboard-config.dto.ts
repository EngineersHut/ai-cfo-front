import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateDashboardConfigDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() totalTrips?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() delPerVeh?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() fleetUtil?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() driverEff?: boolean;
  
  @ApiPropertyOptional() @IsOptional() @IsBoolean() runway?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() growth?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() ebitda?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() cashflow?: boolean;
  
  @ApiPropertyOptional() @IsOptional() @IsBoolean() revTime?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() health?: boolean;
  
  @ApiPropertyOptional() @IsOptional() @IsBoolean() expenseBreakdown?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() aiInsights?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() costAnalysis?: boolean;
}
