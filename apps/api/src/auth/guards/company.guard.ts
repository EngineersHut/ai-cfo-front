import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CompanyService } from '../../company/company.service';
import { IS_COMPANY_OPTIONAL_KEY } from "../../common/decorators/company.decorator";

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    private readonly companyService: CompanyService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isOptional = this.reflector.getAllAndOverride<boolean>(IS_COMPANY_OPTIONAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const companyId = request.headers["x-company-id"] || request.query?.companyId;

    if (!companyId || companyId === 'undefined' || companyId === 'null') {
      if (isOptional) {
        request.company = null;
        return true;
      }
      throw new BadRequestException("x-company-id header is missing");
    }

    const userId = request.user?._id || request.user?.id; // Assuming JwtAuthGuard has already run

    if (!userId) {
      throw new ForbiddenException("User context is missing");
    }

    try {
      const company = await this.companyService.findOne(companyId, userId);
      
      // Attach full company object to the request
      request.company = company;
      
      return true;
    } catch (error) {
      if (isOptional) {
        request.company = null;
        return true;
      }
      throw new ForbiddenException(
        "You do not have access to this company or it does not exist",
      );
    }
  }
}
