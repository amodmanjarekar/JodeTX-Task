import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminsModule } from './admins/admins.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [
    AdminsModule,
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => ({
    //     uri: config.get<string>('MONGO_URI')
    //   })
    // })
    ConfigModule.forRoot(),
    MongooseModule.forRoot("mongodb+srv://amod:123qweasd@jode-cluster.vdo9von.mongodb.net/?retryWrites=true&w=majority&appName=jode-cluster"),
    EmployeesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
