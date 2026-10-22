import type { Selectable } from 'kysely';
import type { Dish, Menu, Option, OptionGroup } from '../../../database/database.types.js';

export type OptionDetails = Pick<Selectable<Option>, 'id' | 'label' | 'price'>;

export type OptionGroupDetails = Pick<
  Selectable<OptionGroup>,
  'id' | 'label' | 'required' | 'maxChoices'
> & {
  options: OptionDetails[];
};

export type DishDetails = Pick<
  Selectable<Dish>,
  'id' | 'label' | 'category' | 'price' | 'available' | 'position'
> & {
  optionGroups: OptionGroupDetails[];
};

export type MenuDetails = Selectable<Menu> & {
  dishes: DishDetails[];
};
