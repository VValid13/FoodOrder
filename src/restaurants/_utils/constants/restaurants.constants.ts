export const RESTAURANT_NAME_MAX_LENGTH = 100;
export const RESTAURANT_ADDRESS_MAX_LENGTH = 200;
export const RESTAURANT_PHONE_MAX_LENGTH = 30;
export const RESTAURANT_DEFAULT_TIMEZONE = 'Europe/Paris';
export const RESTAURANT_MAX_OPENING_HOURS = 50;

export const COORDINATES_PATTERN = /^-?\d{1,2}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;
export const COORDINATES_EXAMPLE = '48.8566,2.3522';

export const MIN_DAY_OF_WEEK = 0;
export const MAX_DAY_OF_WEEK = 6;
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const TIME_LENGTH = 5;

export const NOT_OWNER_MESSAGE = 'You are not the owner of this restaurant';

export const RESTAURANTS_ROUTE = 'restaurants';
export const RESTAURANTS_TAG = 'Restaurants';
export const RESTAURANT_ID_PARAM = 'restaurantId';
export const RESTAURANT_ID_ROUTE = `:${RESTAURANT_ID_PARAM}`;

export const IMPORT_ROUTE = 'import';
export const RESTAURANT_UNKNOWN_ADDRESS = 'Unknown address';
