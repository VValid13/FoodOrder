import { UUID } from 'crypto';

export type JwtPayloadInterface = {
  id: UUID;
  username: string;
};
