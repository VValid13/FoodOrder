export const PLACES_ROUTE = 'places';
export const PLACES_TAG = 'Places';
export const PLACES_LOGGER_CONTEXT = 'Places';
export const PLACES_USER_AGENT = 'FoodOrder/1.0';

export const PLACES_REQUEST_TIMEOUT_MS = 25_000;
export const PLACES_QUERY_TIMEOUT_SECONDS = 10;
export const PLACES_SEARCH_LIMIT = 50;
export const PLACES_MIN_RADIUS_METERS = 1;
export const PLACES_MAX_RADIUS_METERS = 5_000;
export const PLACES_NAME_MAX_LENGTH = 50;
export const PLACES_NAME_PATTERN = /^[\p{L}\p{N} '’-]+$/u;
export const PLACES_AMENITY_PATTERN = '^(restaurant|fast_food)$';

export const EXTERNAL_ID_PATTERN = /^(node|way|relation)\/\d+$/;
export const EXTERNAL_ID_EXAMPLE = 'node/320800037';

export const PLACES_UNAVAILABLE_MESSAGE = 'Places provider is unavailable, try again later';

export const OPENING_HOURS_ALL_WEEK = '24/7';
export const OPENING_HOURS_PUBLIC_HOLIDAY_PREFIX = 'PH';
export const OPENING_HOURS_CLOSED_VALUES = ['off', 'closed'];
export const OPENING_HOURS_END_OF_DAY = '24:00';
export const START_OF_DAY = '00:00';
export const END_OF_DAY = '23:59';
export const OSM_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
export const OSM_DAY_TO_DAY_OF_WEEK = [1, 2, 3, 4, 5, 6, 0] as const;
export const OPENING_HOURS_RULE_PATTERN =
  /^(?:(?<days>[A-Z][a-z][A-Za-z,\- ]*?)\s+)?(?<times>off|closed|[\d:,\- ]+)$/;
export const OPENING_HOURS_TIME_RANGE_PATTERN = /^(?<open>\d{2}:\d{2})-(?<close>\d{2}:\d{2})$/;
export const OPENING_HOURS_OPEN_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const OPENING_HOURS_CLOSE_PATTERN = /^(([01]\d|2[0-3]):[0-5]\d|24:00)$/;
