import {  Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OtpService {
  constructor(
   
  ) {}

  private otpStore = new Map<string, { otp: number; expires: number }>();

  setOtp(email: string, otp: number) {
    const expires = Date.now() + 10* 60 * 1000; // 10 min
    this.otpStore.set(email, { otp, expires });
  }

  getOtp(email: string): number | null {
    const data = this.otpStore.get(email);

    if (!data) return null;

    if (Date.now() > data.expires) {
      this.otpStore.delete(email);
      return null;
    }

    return data.otp;
  }

  deleteOtp(email: string) {
    this.otpStore.delete(email);
  }    
  generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async compareOtp(storedOtp: number, inputOtp: number): Promise<boolean> {
    return storedOtp === inputOtp;
  }
}