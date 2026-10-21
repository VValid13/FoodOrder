import { Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import type { Transaction } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import type { UUID } from 'node:crypto';
import { DAYS_OF_WEEK } from '../_utils/constants/day-of-week.constants.js';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import type { OpeningHour } from '../_utils/types/opening-hour.type.js';
import type { DatabaseTables } from '../database/database.types.js';
import type { NewRestaurant } from './_utils/types/new-restaurant.type.js';
import type { RestaurantDetails } from './_utils/types/restaurant-details.type.js';
import type { RestaurantChanges } from './_utils/types/restaurant-values.type.js';

@Injectable()
export class RestaurantsRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async createRestaurant({ values, openingHours }: NewRestaurant): Promise<UUID> {
    return await this.db.transaction().execute(async (trx) => {
      const { id } = await trx
        .insertInto('restaurant')
        .values(values)
        .returning('id')
        .executeTakeFirstOrThrow();

      await this.insertOpeningHours(trx, id, openingHours);
      return id;
    });
  }

  async importRestaurants(newRestaurants: NewRestaurant[]): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      for (const { values, openingHours } of newRestaurants) {
        const inserted = await trx
          .insertInto('restaurant')
          .values(values)
          .onConflict((conflict) => conflict.column('externalId').doNothing())
          .returning('id')
          .executeTakeFirst();

        if (inserted) {
          await this.insertOpeningHours(trx, inserted.id, openingHours);
        }
      }
    });
  }

  async findRestaurantByIdOrFail(restaurantId: UUID): Promise<RestaurantDetails> {
    return await this.selectDetails()
      .where('restaurant.id', '=', restaurantId)
      .executeTakeFirstOrThrow();
  }

  async findAllRestaurants(): Promise<RestaurantDetails[]> {
    return await this.selectDetails().orderBy('restaurant.name').execute();
  }

  async findRestaurantsByName(name: string): Promise<RestaurantDetails[]> {
    return await this.selectDetails()
      .where('restaurant.name', 'ilike', `%${name}%`)
      .orderBy('restaurant.name')
      .execute();
  }

  async findRestaurantsByExternalIds(externalIds: string[]): Promise<RestaurantDetails[]> {
    if (externalIds.length === 0) {
      return [];
    }
    return await this.selectDetails()
      .where('restaurant.externalId', 'in', externalIds)
      .orderBy('restaurant.name')
      .execute();
  }

  async updateRestaurant(
    restaurantId: UUID,
    changes: RestaurantChanges,
    openingHours: OpeningHour[] | undefined,
  ): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx
        .updateTable('restaurant')
        .set({ ...changes, updatedAt: sql`now()` })
        .where('id', '=', restaurantId)
        .execute();

      if (openingHours) {
        await this.deleteOpeningHours(trx, restaurantId);
        await this.insertOpeningHours(trx, restaurantId, openingHours);
      }
    });
  }

  async deleteRestaurant(restaurantId: UUID): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await this.deleteOpeningHours(trx, restaurantId);
      await trx.deleteFrom('restaurant').where('id', '=', restaurantId).execute();
    });
  }

  private selectDetails() {
    return this.db
      .selectFrom('restaurant')
      .selectAll('restaurant')
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom('menu')
            .select(['menu.id', 'menu.name'])
            .whereRef('menu.id', '=', 'restaurant.menuId'),
        ).as('menu'),
        jsonArrayFrom(
          eb
            .selectFrom('openingSlot')
            .innerJoin(
              'restaurantOpeningSlot',
              'restaurantOpeningSlot.openingSlotId',
              'openingSlot.id',
            )
            .select(['openingSlot.dayOfWeek', 'openingSlot.opensAt', 'openingSlot.closesAt'])
            .whereRef('restaurantOpeningSlot.restaurantId', '=', 'restaurant.id')
            .orderBy('openingSlot.dayOfWeek')
            .orderBy('openingSlot.opensAt'),
        ).as('openingSlots'),
      ]);
  }

  private async insertOpeningHours(
    trx: Transaction<DatabaseTables>,
    restaurantId: UUID,
    openingHours: OpeningHour[],
  ): Promise<void> {
    if (openingHours.length === 0) {
      return;
    }

    const slots = await trx
      .insertInto('openingSlot')
      .values(
        openingHours.map(({ day, open, close }) => ({
          dayOfWeek: DAYS_OF_WEEK.indexOf(day),
          opensAt: open,
          closesAt: close,
        })),
      )
      .returning('id')
      .execute();

    await trx
      .insertInto('restaurantOpeningSlot')
      .values(slots.map(({ id }) => ({ restaurantId, openingSlotId: id })))
      .execute();
  }

  private async deleteOpeningHours(
    trx: Transaction<DatabaseTables>,
    restaurantId: UUID,
  ): Promise<void> {
    await trx
      .deleteFrom('openingSlot')
      .where('id', 'in', (eb) =>
        eb
          .selectFrom('restaurantOpeningSlot')
          .select('openingSlotId')
          .where('restaurantId', '=', restaurantId),
      )
      .execute();
  }
}
