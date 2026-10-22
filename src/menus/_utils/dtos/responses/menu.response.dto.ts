import { ApiProperty } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import { DishResponseDto } from './dish.response.dto.js';

export class MenuResponseDto {
  @ApiProperty({ format: 'uuid', example: '2a044937-1b6d-4674-ba96-1d029c9c1c26' })
  id: UUID;

  @ApiProperty({ example: "McDonald's France" })
  name: string;

  @ApiProperty({ type: [DishResponseDto], description: 'Sorted by category then position' })
  dishes: DishResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
