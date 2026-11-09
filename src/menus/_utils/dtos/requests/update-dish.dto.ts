import { PartialType } from '@nestjs/swagger';
import { CreateDishDto } from './create-dish.dto.js';

export class UpdateDishDto extends PartialType(CreateDishDto, { skipNullProperties: false }) {}
