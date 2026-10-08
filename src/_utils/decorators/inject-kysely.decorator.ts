import { Inject } from '@nestjs/common';
import { KYSELY_TOKEN } from '../constants/database.constants.js';

export function InjectKysely(): PropertyDecorator & ParameterDecorator {
  return Inject(KYSELY_TOKEN);
}
