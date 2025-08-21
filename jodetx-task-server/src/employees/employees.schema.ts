import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema()
export class Employee {
  @Prop({ required: true })
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop()
  salary: number;

  @Prop({ required: true })
  team: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
