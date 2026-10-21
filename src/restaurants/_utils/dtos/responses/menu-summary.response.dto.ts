import { ApiProperty } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';

export class MenuSummaryResponseDto {
  @ApiProperty({ format: 'uuid', example: '6f1c1d52-4c1e-4b8a-9d55-2f5f0f6e8a11' })
  id: UUID;

  @ApiProperty({ example: "McDonald's France" })
  name: string;
}
