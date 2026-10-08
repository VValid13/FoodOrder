import { ApiProperty } from '@nestjs/swagger';
import { HEALTH_STATUS_OK } from '../../_utils/constants/health.constants.js';

export class HealthResponseDto {
  @ApiProperty({ example: HEALTH_STATUS_OK })
  status: string;
}
