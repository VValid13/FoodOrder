import { ApiProperty, OmitType } from '@nestjs/swagger';
import { MenuResponseDto } from '../../../../menus/_utils/dtos/responses/menu.response.dto.js';
import { RestaurantResponseDto } from './restaurant.response.dto.js';

export class RestaurantWithMenuResponseDto extends OmitType(RestaurantResponseDto, ['menu']) {
  @ApiProperty({ type: MenuResponseDto, nullable: true })
  menu: MenuResponseDto | null;
}
