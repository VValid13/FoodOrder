import type { OpeningDay } from '../../../_utils/types/opening-day.type.js';
import type { NewRestaurantValues } from './restaurant-values.type.js';

export type NewRestaurant = {
  values: NewRestaurantValues;
  openingHours: OpeningDay[];
};
