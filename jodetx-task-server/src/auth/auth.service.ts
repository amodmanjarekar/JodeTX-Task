import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from 'src/admins/admin.schema';
import { AdminsService } from 'src/admins/admins.service';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    phone: string,
    password: string,
  ): Promise<Object> {
    const admin = await this.adminsService.findByPhone(phone);
    if (admin?.password !== password) {
      throw new HttpException("Incorrect Password", HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: admin.name };
    return {
        access_token: await this.jwtService.signAsync(payload),
        username: admin.name,
        phone: admin.phone,
    }
  }
}
