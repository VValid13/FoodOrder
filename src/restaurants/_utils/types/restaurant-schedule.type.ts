import type { Selectable } from 'kysely';
import type { OpeningDay } from '../../../_utils/types/opening-day.type.js';
import type { Restaurant } from '../../../database/database.types.js';

export type RestaurantSchedule = Pick<Selectable<Restaurant>, 'timezone'> & {
  openingHours: OpeningDay[];
};
