import { ApiProperty } from '@nestjs/swagger';
import { ToBoolean } from '../../../../_utils/decorators/to-boolean.decorator.js';

export class UpdatePublicLinkDto {
  @ApiProperty({ example: true })
  @ToBoolean()
  publicLinkEnabled: boolean;
}
