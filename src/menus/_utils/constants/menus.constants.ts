export const MENU_NAME_MAX_LENGTH = 100;

export const DISH_LABEL_MAX_LENGTH = 100;
export const DISH_CATEGORY_MAX_LENGTH = 50;
export const MAX_DISHES_PER_MENU = 100;

export const OPTION_GROUP_LABEL_MAX_LENGTH = 50;
export const MAX_OPTION_GROUPS_PER_DISH = 10;

export const OPTION_LABEL_MAX_LENGTH = 50;
export const MAX_OPTIONS_PER_GROUP = 30;

export const MIN_PRICE = 0;
export const MAX_PRICE = 1_000;
export const PRICE_DECIMAL_PLACES = 2;
export const PRICE_FORMAT_MESSAGE = `$property must be a number with at most ${PRICE_DECIMAL_PLACES} decimals`;
export const MIN_POSITION = 0;
export const MIN_CHOICES = 1;

export const MENUS_ROUTE = 'menus';
export const MENUS_TAG = 'Menus';
export const MENU_ID_PARAM = 'menuId';
export const MENU_ID_ROUTE = `:${MENU_ID_PARAM}`;
export const DISH_ID_PARAM = 'dishId';
export const DISHES_ROUTE = `${MENU_ID_ROUTE}/dishes`;
export const DISH_ID_ROUTE = `${DISHES_ROUTE}/:${DISH_ID_PARAM}`;
