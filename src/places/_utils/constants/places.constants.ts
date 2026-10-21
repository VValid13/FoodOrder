export const PLACES_ROUTE = 'places';
export const PLACES_TAG = 'Places';
export const PLACES_LOGGER_CONTEXT = 'Places';
export const PLACES_USER_AGENT = 'FoodOrder/1.0';

export const PLACES_REQUEST_TIMEOUT_MS = 25_000;
export const PLACES_QUERY_TIMEOUT_SECONDS = 10;
export const PLACES_SEARCH_LIMIT = 50;
export const PLACES_SEARCH_RADIUS_METERS = 2_000;
export const PLACES_NAME_MAX_LENGTH = 50;
export const PLACES_NAME_PATTERN = /^[\p{L}\p{N} '’-]+$/u;
export const PLACES_NAME_FORMAT_MESSAGE = '$property contains forbidden characters';
export const PLACES_AMENITY_PATTERN = '^(restaurant|fast_food)$';

export const OPENING_HOURS_REFERENCE_WEEKS = ['2026-03-09', '2026-10-12'];
export const OPENING_HOURS_COUNTRY_CODE = 'fr';
export const OPENING_HOURS_DEFAULT_COORDINATES = { latitude: 46.6, longitude: 2.4 };
export const DAYS_PER_WEEK = 7;
export const OPENING_HOURS_VARIABLE_TIMES_PATTERN = /sunrise|sunset|dawn|dusk/i;
