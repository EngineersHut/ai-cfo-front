import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Company")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // || ---------------------- Create Company API ---------------------|| //
  @Post()
  @ApiOperation({
    summary: "Create a new company",
  })
  create(@Request() req: any, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(
      req.user._id || req.user.id,
      createCompanyDto,
    );
  }

  // || ---------------------- Get All Companies API ---------------------|| //
  @Get()
  @ApiOperation({
    summary: "Get all companies for the current user",
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by company name' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  findAll(
    @Request() req: any,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.companyService.findAll(req.user._id || req.user.id, search, page, limit);
  }

  // || ---------------------- Get Company By ID API ---------------------|| //
  @Get(":id")
  @ApiOperation({
    summary: "Get a specific company by ID",
  })
  findOne(@Param("id") id: string, @Request() req: any) {
    return this.companyService.findOne(id, req.user._id || req.user.id);
  }

  // || ---------------------- Update Company API ---------------------|| //
  @Patch(":id")
  @ApiOperation({
    summary: "Update a company's details",
  })
  update(
    @Param("id") id: string,
    @Request() req: any,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(
      id,
      req.user._id || req.user.id,
      updateCompanyDto,
    );
  }

  // || ---------------------- Soft Delete Company API ---------------------|| //
  @Delete(":id")
  @ApiOperation({
    summary: "Soft delete a company",
  })
  remove(@Param("id") id: string, @Request() req: any) {
    return this.companyService.softDelete(id, req.user._id || req.user.id);
  }

  // || ---------------------- Hard Delete Company API ---------------------|| //
  @Delete(":id/permanent")
  @ApiOperation({
    summary: "Permanently delete a company and all its data",
  })
  removePermanent(@Param("id") id: string, @Request() req: any) {
    return this.companyService.hardDelete(id, req.user._id || req.user.id);
  }

  // || ---------------------- Set Primary Company API ---------------------|| //
  @Patch(":id/primary")
  @ApiOperation({
    summary: "Set a company as the user's primary company",
  })
  setPrimary(@Param("id") id: string, @Request() req: any) {
    return this.companyService.setPrimary(id, req.user._id || req.user.id);
  }
}
