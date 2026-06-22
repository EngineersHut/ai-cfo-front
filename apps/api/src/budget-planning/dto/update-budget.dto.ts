import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsEnum,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { BudgetCategory } from "../../common/enums/budget-category.enum";

export class LineItemDto {
  @IsNotEmpty()
  @IsEnum(BudgetCategory)
  category!: BudgetCategory;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;
}

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsNotEmpty()
  @IsNumber()
  month!: number;

  @IsNotEmpty()
  @IsNumber()
  year!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems!: LineItemDto[];
}
