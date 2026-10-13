import { Injectable } from '@nestjs/common';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../database/database.types.js';
import { UUID } from 'crypto';
import { UserSchema } from './users.schema.js';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectKysely() private readonly db: Kysely<DatabaseTables>,
    //private readonly encriptionService: EncryptionService,
  ) {}

  async findById(id: UUID): Promise<UserSchema> {
    const user = await this.db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    console.log(user);
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserSchema> {
    const newUUID = crypto.randomUUID();
    await this.db
      .insertInto('user')
      .values({
        id: newUUID,
        username: createUserDto.username,
        passwordHash: createUserDto.password,
      })
      .executeTakeFirst();
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', newUUID)
      .executeTakeFirstOrThrow();
  }

  async findOneByUsernameOrThrow(username: string): Promise<UserSchema> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirstOrThrow();
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
