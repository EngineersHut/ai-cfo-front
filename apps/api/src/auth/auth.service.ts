import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generatetoken(data: any) {
    const payload = {
      sub: data._id,
      email: data.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}