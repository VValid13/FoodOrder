import type { OpeningHour } from '../../../_utils/types/opening-hour.type.js';

export type Place = {
  externalId: string;
  name: string;
  address: string | null;
  phone: string | null;
  coordinates: string | null;
  cuisine: string | null;
  openingHours: OpeningHour[];
  openingHoursText: string | null;
};
