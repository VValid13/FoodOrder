import { ApiProperty } from '@nestjs/swagger';
import { ERROR_KEYS } from '../constants/error-code.constants.js';
import type { ErrorCodeType } from '../constants/error-code.constants.js';

export class ErrorResponseDto {
  @ApiProperty({ example: 503 })
  statusCode: number;

  @ApiProperty({ enum: ERROR_KEYS, enumName: 'ErrorCode' })
  code: ErrorCodeType;

  @ApiProperty({ example: 'Database is unavailable' })
  message: string;
}
