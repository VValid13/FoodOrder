import { Injectable } from '@nestjs/common';
import { Encrypter } from './encryptors/template.encrypter.js';
import { BcryptEncrypter } from './encryptors/bcrypt.encrypter.js';


@Injectable()
export class EncryptionService {
  private Encryptor: Encrypter;
  constructor() {
    this.Encryptor = new BcryptEncrypter();
  }

  async encrypt(password: string): Promise<string> {
    return this.Encryptor.encrypt(password);
  }

  async compare(password: string, encryptedPassword: string): Promise<boolean> {
    return this.Encryptor.compare(password, encryptedPassword);
  }
}
