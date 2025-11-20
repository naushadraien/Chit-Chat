import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider {
  async hashData(data: string): Promise<string> {
    const hashedData = await bcrypt.hash(data, 10);
    return hashedData;
  }

  async compareData(data: string, encryptedData: string): Promise<boolean> {
    const isDataMatched = await bcrypt.compare(data, encryptedData);
    return isDataMatched;
  }
}
