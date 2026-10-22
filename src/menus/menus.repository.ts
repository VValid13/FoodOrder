import { Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import type { ExpressionBuilder, Transaction } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import type { UUID } from 'node:crypto';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import type { DatabaseTables } from '../database/database.types.js';
import type { DishDetails, MenuDetails } from './_utils/types/menu-details.type.js';
import type {
  DishUpdate,
  MenuChanges,
  NewDish,
  NewMenuValues,
  NewOptionGroup,
} from './_utils/types/menu-values.type.js';

@Injectable()
export class MenusRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async createMenu(values: NewMenuValues): Promise<UUID> {
    const { id } = await this.db
      .insertInto('menu')
      .values(values)
      .returning('id')
      .executeTakeFirstOrThrow();
    return id;
  }

  async findAllMenus(): Promise<MenuDetails[]> {
    return await this.selectMenuDetails().orderBy('menu.name').execute();
  }

  async findMenuByIdOrFail(menuId: UUID): Promise<MenuDetails> {
    return await this.selectMenuDetails().where('menu.id', '=', menuId).executeTakeFirstOrThrow();
  }

  async updateMenu(menuId: UUID, changes: MenuChanges): Promise<void> {
    await this.db
      .updateTable('menu')
      .set({ ...changes, updatedAt: sql`now()` })
      .where('id', '=', menuId)
      .execute();
  }

  async deleteMenu(menuId: UUID): Promise<void> {
    await this.db.deleteFrom('menu').where('id', '=', menuId).execute();
  }

  async countActiveDishes(menuId: UUID): Promise<number> {
    const { count } = await this.db
      .selectFrom('dish')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .where('menuId', '=', menuId)
      .where('deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
    return Number(count);
  }

  async createDish(menuId: UUID, { values, optionGroups }: NewDish): Promise<UUID> {
    return await this.db.transaction().execute(async (trx) => {
      const { id } = await trx
        .insertInto('dish')
        .values({ ...values, menuId })
        .returning('id')
        .executeTakeFirstOrThrow();

      await this.insertOptionGroups(trx, id, optionGroups);
      return id;
    });
  }

  async findDishByIdOrFail(menuId: UUID, dishId: UUID): Promise<DishDetails> {
    return await this.db
      .selectFrom('dish')
      .select((eb) => [...this.dishColumns, this.optionGroupsOf(eb)])
      .where('dish.id', '=', dishId)
      .where('dish.menuId', '=', menuId)
      .where('dish.deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
  }

  async updateDish(dishId: UUID, { changes, optionGroups }: DishUpdate): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .updateTable('dish')
        .set({ ...changes, updatedAt: sql`now()` })
        .where('id', '=', dishId)
        .execute();

      if (optionGroups) {
        await trx.deleteFrom('optionGroup').where('dishId', '=', dishId).execute();
        await this.insertOptionGroups(trx, dishId, optionGroups);
      }
    });
  }

  async deleteDish(dishId: UUID): Promise<void> {
    await this.db
      .updateTable('dish')
      .set({ deletedAt: sql`now()` })
      .where('id', '=', dishId)
      .execute();
  }

  private readonly dishColumns = [
    'dish.id',
    'dish.label',
    'dish.category',
    'dish.price',
    'dish.available',
    'dish.position',
  ] as const;

  private selectMenuDetails() {
    return this.db
      .selectFrom('menu')
      .selectAll('menu')
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('dish')
            .select((dishEb) => [...this.dishColumns, this.optionGroupsOf(dishEb)])
            .whereRef('dish.menuId', '=', 'menu.id')
            .where('dish.deletedAt', 'is', null)
            .orderBy('dish.category')
            .orderBy('dish.position'),
        ).as('dishes'),
      ]);
  }

  private optionGroupsOf(eb: ExpressionBuilder<DatabaseTables, 'dish'>) {
    return jsonArrayFrom(
      eb
        .selectFrom('optionGroup')
        .select((groupEb) => [
          'optionGroup.id',
          'optionGroup.label',
          'optionGroup.required',
          'optionGroup.maxChoices',
          jsonArrayFrom(
            groupEb
              .selectFrom('option')
              .select(['option.id', 'option.label', 'option.price'])
              .whereRef('option.optionGroupId', '=', 'optionGroup.id')
              .orderBy('option.position'),
          ).as('options'),
        ])
        .whereRef('optionGroup.dishId', '=', 'dish.id')
        .orderBy('optionGroup.position'),
    ).as('optionGroups');
  }

  private async insertOptionGroups(
    trx: Transaction<DatabaseTables>,
    dishId: UUID,
    optionGroups: NewOptionGroup[],
  ): Promise<void> {
    for (const { values, options } of optionGroups) {
      const { id } = await trx
        .insertInto('optionGroup')
        .values({ ...values, dishId })
        .returning('id')
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('option')
        .values(options.map((option) => ({ ...option, optionGroupId: id })))
        .execute();
    }
  }
}
