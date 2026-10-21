import type { OpeningHour } from '../../../_utils/types/opening-hour.type.js';
import type { NewRestaurantValues } from './restaurant-values.type.js';

export type NewRestaurant = {
  values: NewRestaurantValues;
  openingHours: OpeningHour[];
};
