import {
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

  async create(createEmployeeDto: CreateEmployeeDto): Promise<any> {
    try {
      const newEmployee = await this.employeeModel.updateOne(
        {email: createEmployeeDto.email},
        createEmployeeDto,
        {upsert: true}
      );
      return newEmployee
    } catch (err) {
      throw new InternalServerErrorException('Something Bad Happened');
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      const Employees = await this.employeeModel.find().exec();
      return Employees;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException("Something bad happened");
    }
  }

  async bulkInsert(employees: CreateEmployeeDto[]) {
    try {
      const BulkResult = await this.employeeModel.bulkWrite(employees.map( employee => ({
        updateOne: {
          filter: {email: employee.email},
          update: employee,
          upsert: true,
        }
      })));
      return BulkResult;
    } catch (err) {
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async remove(email: string) {
    try {
      const removed = await this.employeeModel.deleteOne({email: email});
    } catch (err) {
      throw new InternalServerErrorException('Something bad happened');
    }
  }
}
