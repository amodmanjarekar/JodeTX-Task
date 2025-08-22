import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(AuthGuard)
  @Post("new")
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @UseGuards(AuthGuard)
  @Post("bulk")
  bulkInsert(@Body() employees: CreateEmployeeDto[]) {
    return this.employeesService.bulkInsert(employees);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {[]
    return this.employeesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:email')
  remove(@Param('email') email: string) {
    return this.employeesService.remove(email);
  }
}
