import * as crypto from 'crypto';

export class ContactEntity {
  id: crypto.UUID;
  ownerId: crypto.UUID;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}
