import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { Optional } from 'class-validator-extended';
import type { SessionStatus } from '../../../../database/database.types.js';
import { SESSION_STATUS_MESSAGE, SESSION_STATUSES } from '../../constants/sessions.constants.js';

export class FindSessionsDto {
  @ApiPropertyOptional({ enum: Object.values(SESSION_STATUSES) })
  @Optional()
  @IsIn(Object.values(SESSION_STATUSES), { message: SESSION_STATUS_MESSAGE })
  status?: SessionStatus;
}
