import {
  PLACES_AMENITY_PATTERN,
  PLACES_QUERY_TIMEOUT_SECONDS,
  PLACES_SEARCH_LIMIT,
} from '../constants/places.constants.js';
import type { SearchAround } from '../types/search-around.type.js';

const QUERY_HEADER = `[out:json][timeout:${PLACES_QUERY_TIMEOUT_SECONDS}];`;
const AMENITY_FILTER = `["amenity"~"${PLACES_AMENITY_PATTERN}"]`;

export function buildSearchQuery({ lat, lon, radius, name }: SearchAround): string {
  const nameFilter = name ? `["name"~"${name}",i]` : '["name"]';
  return `${QUERY_HEADER}nwr${AMENITY_FILTER}${nameFilter}(around:${radius},${lat},${lon});out center tags ${PLACES_SEARCH_LIMIT};`;
}

export function buildLookupQuery(externalId: string): string {
  const [type, id] = externalId.split('/');
  return `${QUERY_HEADER}${type}(${id})${AMENITY_FILTER};out center tags;`;
}
