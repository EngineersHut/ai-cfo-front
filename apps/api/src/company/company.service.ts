import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  // || ---------------------- Create company function ---------------------|| //
  async create(userId: string, createCompanyDto: CreateCompanyDto): Promise<Company> {
    if (createCompanyDto.isPrimary) {
      await this.companyModel.updateMany(
        { userId: userId, deletedAt: null },
        { isPrimary: false }
      );
    }
    const createdCompany = new this.companyModel({
      ...createCompanyDto,
      userId: userId,
    });
    return createdCompany.save();
  }

  // || ---------------------- Get all companies function ---------------------|| //
  async findAll(userId: string, search?: string, page?: number, limit?: number): Promise<any> {
    const query: any = { userId: userId, deletedAt: null };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
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
    const company = await this.companyModel.findOne({ _id: id, userId: userId, deletedAt: null }).exec();
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  // || ---------------------- Update company function ---------------------|| //
  async update(id: string, userId: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    if (updateCompanyDto.isPrimary) {
      await this.companyModel.updateMany(
        { userId: userId, deletedAt: null },
        { isPrimary: false }
      );
    }
    const updatedCompany = await this.companyModel
      .findOneAndUpdate({ _id: id, userId: userId, deletedAt: null }, updateCompanyDto, { new: true })
      .exec();
    if (!updatedCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return updatedCompany;
  }

  // || ---------------------- Soft delete company function ---------------------|| //
  async softDelete(id: string, userId: string): Promise<void> {
    const result = await this.companyModel.findOneAndUpdate(
      { _id: id, userId: userId, deletedAt: null },
      { deletedAt: new Date() },
    ).exec();
    if (!result) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
  }

  // || ---------------------- Set primary company function ---------------------|| //
  async setPrimary(id: string, userId: string): Promise<Company> {
    await this.companyModel.updateMany(
      { userId: userId, deletedAt: null },
      { isPrimary: false }
    );
    const updatedCompany = await this.companyModel
      .findOneAndUpdate({ _id: id, userId: userId, deletedAt: null }, { isPrimary: true }, { new: true })
      .exec();
    
    if (!updatedCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return updatedCompany;
  }
}
