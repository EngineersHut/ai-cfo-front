import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Company, CompanyDocument } from "../schemas/company.schema";
import {
  DashboardSummary,
  DashboardSummaryDocument,
} from "../schemas/dashboard-summary.schema";
import {
  GrowthAnalytics,
  GrowthAnalyticsDocument,
} from "../schemas/growth-analytics.schema";
import {
  FleetAnalytics,
  FleetAnalyticsDocument,
} from "../schemas/fleet-analytics.schema";
import {
  BudgetPlanning,
  BudgetPlanningDocument,
} from "../schemas/budget-planning.schema";
import {
  Transaction,
  TransactionDocument,
} from "../schemas/transaction.schema";
import {
  DashboardConfig,
  DashboardConfigDocument,
} from "../schemas/dashboard-config.schema";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(DashboardSummary.name)
    private dashboardModel: Model<DashboardSummaryDocument>,
    @InjectModel(GrowthAnalytics.name)
    private growthModel: Model<GrowthAnalyticsDocument>,
    @InjectModel(FleetAnalytics.name)
    private fleetModel: Model<FleetAnalyticsDocument>,
    @InjectModel(BudgetPlanning.name)
    private budgetModel: Model<BudgetPlanningDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(DashboardConfig.name)
    private dashboardConfigModel: Model<DashboardConfigDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  // || ---------------------- Create company function ---------------------|| //
  async create(
    userId: string,
    createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    if (createCompanyDto.isPrimary) {
      await this.companyModel.updateMany(
        { userId: userId, deletedAt: null },
        { isPrimary: false },
      );
    }
    const createdCompany = new this.companyModel({
      ...createCompanyDto,
      userId: userId,
    });
    return createdCompany.save();
  }

  // || ---------------------- Get all companies function ---------------------|| //
  async findAll(
    userId: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<any> {
    const query: any = { userId: userId, deletedAt: null };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.companyModel.find(query).skip(skip).limit(limit).exec(),
        this.companyModel.countDocuments(query).exec(),
      ]);
      return {
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };
    }

    const data = await this.companyModel.find(query).exec();
    return data;
  }

  // || ---------------------- Get company by ID function ---------------------|| //
  async findOne(id: string, userId: string): Promise<Company> {
    const company = await this.companyModel
      .findOne({ _id: id, userId: userId, deletedAt: null })
      .exec();
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  // || ---------------------- Update company function ---------------------|| //
  async update(
    id: string,
    userId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    if (updateCompanyDto.isPrimary) {
      await this.companyModel.updateMany(
        { userId: userId, deletedAt: null },
        { isPrimary: false },
      );
    }
    const updatedCompany = await this.companyModel
      .findOneAndUpdate(
        { _id: id, userId: userId, deletedAt: null },
        updateCompanyDto,
        { returnDocument: 'after' },
      )
      .exec();
    if (!updatedCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return updatedCompany;
  }

  // || ---------------------- Soft delete company function ---------------------|| //
  async softDelete(id: string, userId: string): Promise<void> {
    const result = await this.companyModel
      .findOneAndUpdate(
        { _id: id, userId: userId, deletedAt: null },
        { deletedAt: new Date() },
      )
      .exec();
    if (!result) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
  }

  // || ---------------------- Hard delete company function ---------------------|| //
  async hardDelete(id: string, userId: string): Promise<void> {
    const company = await this.companyModel
      .findOne({ _id: id, userId: userId })
      .exec();
    if (!company) {
      throw new NotFoundException(
        `Company with ID ${id} not found or you don't have permission`,
      );
    }

    const companyId = id;

    // 1. Delete from all static collections
    await Promise.all([
      this.dashboardModel.deleteMany({ companyId }),
      this.growthModel.deleteMany({ companyId }),
      this.fleetModel.deleteMany({ companyId }),
      this.budgetModel.deleteMany({ companyId }),
      this.transactionModel.deleteMany({ companyId }),
      this.dashboardConfigModel.deleteMany({ companyId }),
    ]);

    // 2. Drop the dynamic collection for this company (holds reports and other dynamic docs)
    const collectionName = `company_${companyId}`;
    try {
      if (this.connection.db) {
        const collections = await this.connection.db
          .listCollections({ name: collectionName })
          .toArray();
        if (collections.length > 0) {
          await this.connection.db.dropCollection(collectionName);
        }
      }
    } catch (err) {
      console.error(`Failed to drop collection ${collectionName}`, err);
    }

    // 3. Delete the company document
    await this.companyModel.deleteOne({ _id: id, userId: userId }).exec();
  }

  // || ---------------------- Set primary company function ---------------------|| //
  async setPrimary(id: string, userId: string): Promise<Company> {
    await this.companyModel.updateMany(
      { userId: userId, deletedAt: null },
      { isPrimary: false },
    );
    const updatedCompany = await this.companyModel
      .findOneAndUpdate(
        { _id: id, userId: userId, deletedAt: null },
        { isPrimary: true },
        { returnDocument: 'after' },
      )
      .exec();

    if (!updatedCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return updatedCompany;
  }
}
