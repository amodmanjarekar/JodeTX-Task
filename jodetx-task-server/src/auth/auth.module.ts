import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminsModule } from 'src/admins/admins.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AdminsModule,
    JwtModule.register({
      global: true,
      secret: '123',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
