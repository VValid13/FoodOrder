import { Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import type { Transaction } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import type { UUID } from 'node:crypto';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import type { DatabaseTables } from '../database/database.types.js';
import { RestaurantsExceptions } from './_utils/exceptions/restaurants.exceptions.js';
import type { OpeningHour } from '../_utils/types/opening-hour.type.js';
import type { RestaurantDetails } from './_utils/types/restaurant-details.type.js';
import type {
  NewRestaurantValues,
  RestaurantChanges,
} from './_utils/types/restaurant-values.type.js';

@Injectable()
export class RestaurantsRepository {
  constructor(
    @InjectKysely() private readonly db: Kysely<DatabaseTables>,
    private readonly restaurantsExceptions: RestaurantsExceptions,
  ) {}

  async create(
    ownerId: UUID,
    values: NewRestaurantValues,
    openingHours: OpeningHour[],
  ): Promise<UUID> {
    return await this.db.transaction().execute(async (trx) => {
      const { id } = await trx
        .insertInto('restaurant')
        .values({ ...values, ownerId })
        .returning('id')
        .executeTakeFirstOrThrow();

      await this.insertOpeningHours(trx, id, openingHours);
      return id;
    });
  }

  async findDetailsByIdOrFail(restaurantId: UUID): Promise<RestaurantDetails> {
    return await this.selectDetails()
      .where('restaurant.id', '=', restaurantId)
      .executeTakeFirstOrThrow(() => this.restaurantsExceptions.restaurantNotFound(restaurantId));
  }

  async findAllDetailsByOwner(ownerId: UUID): Promise<RestaurantDetails[]> {
    return await this.selectDetails()
      .where('restaurant.ownerId', '=', ownerId)
      .orderBy('restaurant.createdAt', 'desc')
      .execute();
  }

  async existsByOwnerAndExternalId(ownerId: UUID, externalId: string): Promise<boolean> {
    const restaurant = await this.db
      .selectFrom('restaurant')
      .select('id')
      .where('ownerId', '=', ownerId)
      .where('externalId', '=', externalId)
      .executeTakeFirst();
    return restaurant !== undefined;
  }

  async menuExists(menuId: UUID): Promise<boolean> {
    const menu = await this.db
      .selectFrom('menu')
      .select('id')
      .where('id', '=', menuId)
      .executeTakeFirst();
    return menu !== undefined;
  }

  async isUsedBySession(restaurantId: UUID): Promise<boolean> {
    const session = await this.db
      .selectFrom('session')
      .select('id')
      .where('restaurantId', '=', restaurantId)
      .limit(1)
      .executeTakeFirst();
    return session !== undefined;
  }

  async update(
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

  async delete(restaurantId: UUID): Promise<void> {
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
          dayOfWeek: day,
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
