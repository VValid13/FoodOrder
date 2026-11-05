import type { Insertable, Selectable, Updateable } from 'kysely';
import type { Session } from '../../../database/database.types.js';

type EditableSessionColumns =
  | 'label'
  | 'deadlineAt'
  | 'pickupAt'
  | 'paymentMode'
  | 'payerName'
  | 'fees'
  | 'discount'
  | 'freeMode';

export type NewSessionValues = Pick<
  Insertable<Session>,
  EditableSessionColumns | 'restaurantId' | 'creatorId' | 'publicSlug' | 'expiresAt'
>;

export type SessionChanges = Pick<Updateable<Session>, EditableSessionColumns>;

export type SessionSchedule = Pick<Selectable<Session>, 'deadlineAt' | 'pickupAt'>;
