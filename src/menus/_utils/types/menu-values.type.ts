import type { Insertable, Updateable } from 'kysely';
import type { Dish, Menu, Option, OptionGroup } from '../../../database/database.types.js';

type EditableDishColumns = 'label' | 'category' | 'price' | 'available' | 'position';

export type NewMenuValues = Pick<Insertable<Menu>, 'name'>;
export type MenuChanges = Pick<Updateable<Menu>, 'name'>;

export type NewOptionValues = Pick<Insertable<Option>, 'label' | 'price' | 'position'>;

export type NewOptionGroup = {
  values: Pick<Insertable<OptionGroup>, 'label' | 'required' | 'maxChoices' | 'position'>;
  options: NewOptionValues[];
};

export type NewDish = {
  values: Pick<Insertable<Dish>, EditableDishColumns>;
  optionGroups: NewOptionGroup[];
};

export type DishUpdate = {
  changes: Pick<Updateable<Dish>, EditableDishColumns>;
  optionGroups: NewOptionGroup[] | undefined;
};
