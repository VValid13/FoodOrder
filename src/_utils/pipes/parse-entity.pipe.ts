import { Inject, Injectable, mixin } from '@nestjs/common';
import type { PipeTransform, Type } from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { UUIDFormatException } from '../global.exception.js';
import { isUuid } from '../helpers/is-uuid.helper.js';

type FoundEntity<TRepository, TMethod extends keyof TRepository> = TRepository[TMethod] extends (
  id: UUID,
) => Promise<infer TEntity>
  ? TEntity
  : never;

type EntityFinder<TRepository, TMethod extends keyof TRepository & string> = Record<
  TMethod,
  (id: UUID) => Promise<FoundEntity<TRepository, TMethod>>
>;

export function ParseEntityPipe<
  TRepository extends EntityFinder<TRepository, TMethod>,
  TMethod extends keyof TRepository & string,
>(
  repository: Type<TRepository>,
  findMethod: TMethod,
): Type<PipeTransform<string, Promise<FoundEntity<TRepository, TMethod>>>> {
  @Injectable()
  class ParseEntityDynamicPipe implements PipeTransform<
    string,
    Promise<FoundEntity<TRepository, TMethod>>
  > {
    constructor(@Inject(repository) private readonly repositoryInstance: TRepository) {}

    async transform(value: string): Promise<FoundEntity<TRepository, TMethod>> {
      if (!isUuid(value)) {
        throw UUIDFormatException;
      }
      return await this.repositoryInstance[findMethod](value);
    }
  }

  return mixin(ParseEntityDynamicPipe);
}
