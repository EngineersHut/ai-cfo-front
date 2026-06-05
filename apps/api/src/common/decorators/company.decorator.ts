import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CompanyDocument } from '../../schemas/company.schema';

export const CurrentCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CompanyDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.company;
  },
);
