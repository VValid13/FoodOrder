import * as bcrypt from 'bcrypt';
import { Encrypter } from './template.encrypter.js';

export class BcryptEncrypter extends Encrypter {
  name: string = 'Bcrypt';

  securityLevel: number = 50;

  async encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  async compare(password: string, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }
}
