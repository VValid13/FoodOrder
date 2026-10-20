import type { Insertable, Updateable } from 'kysely';
import type { Restaurant } from '../../../database/database.types.js';

type ManagedColumns = 'id' | 'ownerId' | 'createdAt' | 'updatedAt';

export type NewRestaurantValues = Omit<Insertable<Restaurant>, ManagedColumns>;
export type RestaurantChanges = Omit<Updateable<Restaurant>, ManagedColumns | 'externalId'>;
