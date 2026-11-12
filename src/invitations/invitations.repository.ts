import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import type {
  DatabaseTables,
  ParticipantStatus,
  Session,
  SessionMember,
} from '../database/database.types.js';
import { MAX_PARTICIPANTS_PER_SESSION } from './_utils/constants/invitations.constants.js';
import type { UserInvitation } from './_utils/types/user-invitation.type.js';
import type { NewParticipantValues } from './_utils/types/participant-values.type.js';

@Injectable()
export class InvitationsRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async createParticipants(
    sessionId: UUID,
    participants: NewParticipantValues[],
  ): Promise<Selectable<SessionMember>[] | undefined> {
    return await this.db.transaction().execute(async (trx) => {
      await trx
        .selectFrom('session')
        .select('id')
        .where('id', '=', sessionId)
        .forUpdate()
        .executeTakeFirstOrThrow();
      const currentParticipants = await trx
        .selectFrom('sessionMember')
        .select('id')
        .where('sessionId', '=', sessionId)
        .execute();
      if (currentParticipants.length + participants.length > MAX_PARTICIPANTS_PER_SESSION) {
        return undefined;
      }

      return await trx
        .insertInto('sessionMember')
        .values(participants)
        .onConflict((conflict) => conflict.doNothing())
        .returningAll()
        .execute();
    });
  }

  async updateParticipantTokenHash(
    participantId: UUID,
    tokenHash: string | null,
  ): Promise<Selectable<SessionMember>> {
    return await this.db
      .updateTable('sessionMember')
      .set({ tokenHash, updatedAt: new Date() })
      .where('id', '=', participantId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateParticipantStatus(
    participantId: UUID,
    status: ParticipantStatus,
  ): Promise<Selectable<SessionMember>> {
    return await this.db
      .updateTable('sessionMember')
      .set({ status, updatedAt: new Date() })
      .where('id', '=', participantId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findParticipantByTokenHash(
    tokenHash: string,
  ): Promise<Selectable<SessionMember> | undefined> {
    return await this.db
      .selectFrom('sessionMember')
      .selectAll()
      .where('tokenHash', '=', tokenHash)
      .executeTakeFirst();
  }

  async findSessionByIdOrFail(sessionId: UUID): Promise<Selectable<Session>> {
    return await this.db
      .selectFrom('session')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirstOrThrow();
  }

  async findSessionByShareToken(shareToken: string): Promise<Selectable<Session> | undefined> {
    return await this.db
      .selectFrom('session')
      .selectAll()
      .where('shareToken', '=', shareToken)
      .executeTakeFirst();
  }

  async linkParticipantAccount(
    { id, sessionId }: Selectable<SessionMember>,
    userId: UUID,
  ): Promise<Selectable<SessionMember> | undefined> {
    return await this.db
      .updateTable('sessionMember')
      .set({ userId, updatedAt: new Date() })
      .where('id', '=', id)
      .where('userId', 'is', null)
      .where(({ not, exists, selectFrom }) =>
        not(
          exists(
            selectFrom('sessionMember')
              .select('id')
              .where('sessionId', '=', sessionId)
              .where('userId', '=', userId),
          ),
        ),
      )
      .returningAll()
      .executeTakeFirst();
  }

  async findUserInvitations(userId: UUID): Promise<UserInvitation[]> {
    return await this.db
      .selectFrom('session')
      .innerJoin('sessionMember', 'sessionMember.sessionId', 'session.id')
      .selectAll('session')
      .select([
        'sessionMember.id as participantId',
        'sessionMember.name as participantName',
        'sessionMember.status as participantStatus',
        'sessionMember.userId',
      ])
      .where('sessionMember.userId', '=', userId)
      .orderBy('session.deadlineAt', 'desc')
      .execute();
  }
}
