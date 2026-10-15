import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../database/database.types.js';
import { UUID } from 'crypto';
import { UserSchema } from './users.schema.js';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { EncryptionService } from '../encryption/encryption.service.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectKysely() private readonly db: Kysely<DatabaseTables>,
    private readonly encriptionService: EncryptionService,
  ) {}

  async findById(id: UUID): Promise<UserSchema> {
    const result = await this.db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if(!result) {throw new NotFoundException('unknown id');}
    return result;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserSchema> {
    const newUUID = crypto.randomUUID();
    const passHash = await this.encriptionService.encrypt(createUserDto.password);
    await this.db
      .insertInto('user')
      .values({
        id: newUUID,
        username: createUserDto.username,
        passwordHash: passHash,
      })
      .executeTakeFirst();
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', newUUID)
      .executeTakeFirstOrThrow();
  }

  async findOneByUsername(username: string): Promise<UserSchema> {
    const result = await this.db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();
    if (!result) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    return result;
  }

  async updatePasswordById(id: UUID, new_password: string) {
    return await this.db
      .updateTable('user')
      .set({
        passwordHash: new_password,
      })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}
