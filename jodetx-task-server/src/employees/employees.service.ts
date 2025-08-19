import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './employees.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.employeeModel.find({
      email: createEmployeeDto.email,
    });

    if (existing.length > 0) {
      throw new BadRequestException('Duplicate email');
    } else {
      try {
        const newEmployee = await this.employeeModel.create(createEmployeeDto);
        return newEmployee;
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException('Something bad happened');
      }
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      const Employees = await this.employeeModel.find().exec();
      return Employees;
    } catch (err) {
      console.log(err);
      throw new Error('Something bad happened');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
