import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { CompanyDocument } from '../../schemas/company.schema';

export const IS_COMPANY_OPTIONAL_KEY = 'isCompanyOptional';
export const CompanyOptional = () => SetMetadata(IS_COMPANY_OPTIONAL_KEY, true);

export const CurrentCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CompanyDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.company;
  },
);
