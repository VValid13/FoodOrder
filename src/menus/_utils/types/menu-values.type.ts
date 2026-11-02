import type { Insertable, Updateable } from 'kysely';
import type { UUID } from 'node:crypto';
import type { Dish, Menu, Option, OptionGroup } from '../../../database/database.types.js';

type EditableDishColumns = 'label' | 'category' | 'price';

export type NewMenuValues = Pick<Insertable<Menu>, 'name'>;
export type MenuChanges = Pick<Updateable<Menu>, 'name'>;

export type OptionInput = {
  id: UUID | undefined;
  values: Pick<Insertable<Option>, 'label' | 'price' | 'position'>;
};

export type OptionGroupInput = {
  id: UUID | undefined;
  values: Pick<Insertable<OptionGroup>, 'label' | 'required' | 'maxChoices' | 'position'>;
  options: OptionInput[];
};

export type NewDish = {
  values: Pick<Insertable<Dish>, EditableDishColumns>;
  optionGroups: OptionGroupInput[];
};

export type DishUpdate = {
  changes: Pick<Updateable<Dish>, EditableDishColumns>;
  optionGroups: OptionGroupInput[] | undefined;
};
