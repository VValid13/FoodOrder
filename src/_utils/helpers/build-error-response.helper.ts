import type { HttpStatus } from '@nestjs/common';
import type { ErrorCodeType } from '../constants/error-code.constants.js';
import type { ErrorResponseDto } from '../dtos/error-response.dto.js';

export function buildErrorResponse(
  statusCode: HttpStatus,
  code: ErrorCodeType,
  message: string,
): ErrorResponseDto {
  return { statusCode, code, message };
}
