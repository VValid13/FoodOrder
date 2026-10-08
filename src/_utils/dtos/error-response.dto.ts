import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../constants/error-code.constants.js';

export class ErrorResponseDto {
  @ApiProperty({ example: 503 })
  statusCode: number;

  @ApiProperty({ enum: ErrorCode, enumName: 'ErrorCode' })
  code: ErrorCode;

  @ApiProperty({ example: 'Database is unavailable' })
  message: string;
}
