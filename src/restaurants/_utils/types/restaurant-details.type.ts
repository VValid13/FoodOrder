import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import type { Restaurant } from '../../../database/database.types.js';

export type RestaurantDetails = Selectable<Restaurant> & {
  menu: { id: UUID; name: string } | null;
  openingSlots: { dayOfWeek: number; opensAt: string; closesAt: string }[];
};
