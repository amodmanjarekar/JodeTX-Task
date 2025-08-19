import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.schema';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async create(createAdminDto: CreateAdminDto) : Promise<Admin> {
    const newAdmin = await this.adminModel.create(createAdminDto);
    return newAdmin;
  }

  async findByPhone(phone: string) {
    const findAdmin = await this.adminModel.find({ phone: phone });
    return findAdmin;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
