export const RESTAURANT_NAME_MAX_LENGTH = 100;
export const RESTAURANT_ADDRESS_MAX_LENGTH = 200;
export const RESTAURANT_PHONE_MAX_LENGTH = 30;
export const RESTAURANT_DEFAULT_TIMEZONE = 'Europe/Paris';
export const RESTAURANT_MAX_OPENING_HOURS = 50;
export const RESTAURANT_UNKNOWN_ADDRESS = 'Unknown address';

export const RESTAURANTS_ROUTE = 'restaurants';
export const RESTAURANTS_TAG = 'Restaurants';
export const RESTAURANT_ID_PARAM = 'restaurantId';
export const RESTAURANT_ID_ROUTE = `:${RESTAURANT_ID_PARAM}`;

export const RESTAURANT_SEARCH_NAME_MAX_LENGTH = 50;
export const RESTAURANT_SEARCH_NAME_PATTERN = /^[\p{L}\p{N} '’-]+$/u;
export const RESTAURANT_SEARCH_NAME_MESSAGE = '$property contains forbidden characters';
