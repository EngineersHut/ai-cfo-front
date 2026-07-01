import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GetBudgetDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  period?: string; // 'monthly', 'quarterly', 'yearly'

  @IsOptional()
  month?: number;

  @IsOptional()
  year?: number;

  @IsOptional()
  quarter?: number;
}
