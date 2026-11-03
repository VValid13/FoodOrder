import { ApiProperty } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import { OptionResponseDto } from './option.response.dto.js';

export class OptionGroupResponseDto {
  @ApiProperty({ format: 'uuid', example: '1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a8b' })
  id: UUID;

  @ApiProperty({ example: 'Size' })
  label: string;

  @ApiProperty({ example: true })
  required: boolean;

  @ApiProperty({ example: 1 })
  maxChoices: number;

  @ApiProperty({ type: [OptionResponseDto] })
  options: OptionResponseDto[];
}
