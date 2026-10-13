import { UUID } from 'crypto';

export default interface JwtPayloadInterface {
  id: UUID;
  username: string;
}
