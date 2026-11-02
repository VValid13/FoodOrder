import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import type { ExpressionBuilder, Selectable, Transaction } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import type { UUID } from 'node:crypto';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import type { DatabaseTables, Menu } from '../database/database.types.js';
import type { DishDetails, MenuDetails } from './_utils/types/menu-details.type.js';
import type {
  DishUpdate,
  MenuChanges,
  NewDish,
  NewMenuValues,
  OptionGroupInput,
  OptionInput,
} from './_utils/types/menu-values.type.js';

@Injectable()
export class MenusRepository {
  private readonly dishColumns = ['dish.id', 'dish.label', 'dish.category', 'dish.price'] as const;

  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async createMenu(values: NewMenuValues): Promise<Selectable<Menu>> {
    return await this.db.insertInto('menu').values(values).returningAll().executeTakeFirstOrThrow();
  }

  async findAllMenus(): Promise<MenuDetails[]> {
    return await this.selectMenuDetails().orderBy('menu.name').execute();
  }

  async findMenuByIdOrFail(menuId: UUID): Promise<MenuDetails> {
    return await this.selectMenuDetails().where('menu.id', '=', menuId).executeTakeFirstOrThrow();
  }

  async updateMenu(menuId: UUID, changes: MenuChanges): Promise<Selectable<Menu>> {
    return await this.db
      .updateTable('menu')
      .set({ ...changes, updatedAt: new Date() })
      .where('id', '=', menuId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async deleteMenu(menuId: UUID): Promise<void> {
    await this.db.deleteFrom('menu').where('id', '=', menuId).execute();
  }

  async createDish(menuId: UUID, { values, optionGroups }: NewDish): Promise<UUID> {
    return await this.db.transaction().execute(async (trx) => {
      const dishId = (
        await trx
          .insertInto('dish')
          .values({ ...values, menuId })
          .returning('id')
          .executeTakeFirstOrThrow()
      ).id;

      for (const group of optionGroups) {
        await this.insertOptionGroup(trx, dishId, group);
      }
      return dishId;
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
        .set({ ...changes, updatedAt: new Date() })
        .where('id', '=', dishId)
        .execute();

      if (optionGroups) {
        await this.syncOptionGroups(trx, dishId, optionGroups);
      }
    });
  }

  async deleteDish(dishId: UUID): Promise<void> {
    await this.db
      .updateTable('dish')
      .set({ deletedAt: new Date() })
      .where('id', '=', dishId)
      .execute();
  }

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
            .orderBy('dish.label'),
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

  private async insertOptionGroup(
    trx: Transaction<DatabaseTables>,
    dishId: UUID,
    { values, options }: OptionGroupInput,
  ): Promise<void> {
    const optionGroupId = (
      await trx
        .insertInto('optionGroup')
        .values({ ...values, dishId })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id;

    await trx
      .insertInto('option')
      .values(options.map((option) => ({ ...option.values, optionGroupId })))
      .execute();
  }

  private async syncOptionGroups(
    trx: Transaction<DatabaseTables>,
    dishId: UUID,
    optionGroups: OptionGroupInput[],
  ): Promise<void> {
    const keptGroupIds = this.idsOf(optionGroups);
    await trx
      .deleteFrom('optionGroup')
      .where('dishId', '=', dishId)
      .$if(keptGroupIds.length > 0, (query) => query.where('id', 'not in', keptGroupIds))
      .execute();

    for (const group of optionGroups) {
      if (!group.id) {
        await this.insertOptionGroup(trx, dishId, group);
        continue;
      }

      await trx
        .updateTable('optionGroup')
        .set(group.values)
        .where('id', '=', group.id)
        .where('dishId', '=', dishId)
        .returning('id')
        .executeTakeFirstOrThrow();

      await this.syncOptions(trx, group.id, group.options);
    }
  }

  private async syncOptions(
    trx: Transaction<DatabaseTables>,
    optionGroupId: UUID,
    options: OptionInput[],
  ): Promise<void> {
    const keptOptionIds = this.idsOf(options);
    await trx
      .deleteFrom('option')
      .where('optionGroupId', '=', optionGroupId)
      .$if(keptOptionIds.length > 0, (query) => query.where('id', 'not in', keptOptionIds))
      .execute();

    for (const option of options) {
      if (!option.id) {
        await trx
          .insertInto('option')
          .values({ ...option.values, optionGroupId })
          .execute();
        continue;
      }

      await trx
        .updateTable('option')
        .set({ ...option.values, updatedAt: new Date() })
        .where('id', '=', option.id)
        .where('optionGroupId', '=', optionGroupId)
        .returning('id')
        .executeTakeFirstOrThrow();
    }
  }

  private idsOf(items: { id: UUID | undefined }[]): UUID[] {
    return items.flatMap(({ id }) => (id ? [id] : []));
  }
}
