import { UUID } from "crypto";
import { Selectable } from "kysely";
import { UserGroup } from "../../../database/database.types.js";


export type ContactGroup = Selectable<UserGroup> & {
  id: UUID;
  ownerId: UUID;
  label: string;
  createdAt: Date;
  updatedAt: Date;
};
