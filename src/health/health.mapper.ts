import { HEALTH_STATUS_OK } from '../_utils/constants/health.constants.js';
import type { HealthResponseDto } from './dto/health-response.dto.js';

export function toHealthResponseDto(): HealthResponseDto {
  return { status: HEALTH_STATUS_OK };
}
