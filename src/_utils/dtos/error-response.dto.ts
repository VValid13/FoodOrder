import { ApiProperty } from '@nestjs/swagger';
import * as errorCodeConstants from '../constants/error-code.constants.js';

export class ErrorResponseDto {
  @ApiProperty({ example: 503 })
  statusCode: number;

  @ApiProperty({ enum: errorCodeConstants.ERROR_KEYS, enumName: 'ErrorCode' })
  code: errorCodeConstants.ErrorCodeType;

  @ApiProperty({ example: 'Database is unavailable' })
  message: string;
}
