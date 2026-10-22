import type { Insertable, Updateable } from 'kysely';
import type { Restaurant } from '../../../database/database.types.js';

type EditableColumns =
  | 'name'
  | 'address'
  | 'phone'
  | 'latitude'
  | 'longitude'
  | 'timezone'
  | 'menuId';

export type NewRestaurantValues = Pick<Insertable<Restaurant>, EditableColumns | 'externalId'>;
export type RestaurantChanges = Pick<Updateable<Restaurant>, EditableColumns>;
