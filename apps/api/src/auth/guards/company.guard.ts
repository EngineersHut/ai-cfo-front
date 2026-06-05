import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { CompanyService } from '../../company/company.service';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    private readonly companyService: CompanyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const companyId = request.headers["x-company-id"];

    if (!companyId) {
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
      throw new ForbiddenException(
        "You do not have access to this company or it does not exist",
      );
    }
  }
}
