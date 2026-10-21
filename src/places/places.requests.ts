import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import type { OverpassResponse } from './_utils/types/overpass-element.type.js';

@Injectable()
export class PlacesRequests {
  constructor(private readonly httpService: HttpService) {}

  runQuery = (query: string) =>
    this.httpService.axiosRef
      .post<OverpassResponse>('', new URLSearchParams({ data: query }))
      .then((r) => r.data.elements);
}
