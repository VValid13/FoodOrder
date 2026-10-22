import { ApiProperty } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import { OptionGroupResponseDto } from './option-group.response.dto.js';

export class DishResponseDto {
  @ApiProperty({ format: 'uuid', example: '9b1f6c3e-7d2a-4e5b-8c9d-0a1b2c3d4e5f' })
  id: UUID;

  @ApiProperty({ example: 'Big Mac' })
  label: string;

  @ApiProperty({ example: 'Burgers' })
  category: string;

  @ApiProperty({ example: 8.3 })
  price: number;

  @ApiProperty({ example: true })
  available: boolean;

  @ApiProperty({ example: 0 })
  position: number;

  @ApiProperty({ type: [OptionGroupResponseDto] })
  optionGroups: OptionGroupResponseDto[];
}
