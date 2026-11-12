import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import { ConnectedUser } from '../_utils/decorators/connected-user-decorator.js';
import { getEntityByIdPipe } from '../_utils/pipes/get-entity-by-id.pipe.js';
import { ParseUuidPipe } from '../_utils/pipes/parse-uuid.pipe.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import type { Session, SessionMember } from '../database/database.types.js';
import {
  SESSION_ID_PARAM,
  SESSIONS_ROUTE,
  SESSIONS_SWAGGER,
} from '../sessions/_utils/constants/sessions.constants.js';
import type { UserEntity } from '../users/users.entity.js';
import {
  CONTACT_LIST_ID_PARAM,
  INVITATIONS_SWAGGER,
  INVITATIONS_TAG,
  PARTICIPANT_ID_PARAM,
  SESSION_CONTACT_LIST_INVITATIONS_ROUTE,
  SESSION_INVITATIONS_ROUTE,
  SESSION_PARTICIPANT_LINK_ROUTE,
} from './_utils/constants/invitations.constants.js';
import { CreateInvitationsDto } from './_utils/dtos/requests/create-invitations.dto.js';
import { InvitationsResponseDto } from './_utils/dtos/responses/invitations.response.dto.js';
import { InvitedParticipantResponseDto } from './_utils/dtos/responses/invited-participant.response.dto.js';
import {
  CONTACT_LIST_EMPTY_MESSAGE,
  PARTICIPANT_NOT_FOUND_MESSAGE,
} from './_utils/exceptions/invitations.exceptions.js';
import { InvitationsService } from './invitations.service.js';

const ParseSessionPipe = getEntityByIdPipe('session');
const ParseParticipantPipe = getEntityByIdPipe('sessionMember', {
  notFoundMessage: PARTICIPANT_NOT_FOUND_MESSAGE,
});

@ApiTags(INVITATIONS_TAG)
@Controller(SESSIONS_ROUTE)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Protect()
  @Post(SESSION_INVITATIONS_ROUTE)
  @ApiOperation({ summary: INVITATIONS_SWAGGER.CREATE })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiCreatedResponse({ type: InvitationsResponseDto })
  @ApiBadRequestResponse({ description: INVITATIONS_SWAGGER.INVALID_ID_OR_BODY })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: SESSIONS_SWAGGER.SESSION_NOT_FOUND })
  @ApiConflictResponse({ description: INVITATIONS_SWAGGER.CONFLICT })
  async createInvitations(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
    @Body() createInvitationsDto: CreateInvitationsDto,
  ): Promise<InvitationsResponseDto> {
    return await this.invitationsService.createInvitations(session, createInvitationsDto, user);
  }

  @Protect()
  @Post(SESSION_CONTACT_LIST_INVITATIONS_ROUTE)
  @ApiOperation({ summary: INVITATIONS_SWAGGER.CREATE_FROM_CONTACT_LIST })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiParam({ name: CONTACT_LIST_ID_PARAM, format: 'uuid' })
  @ApiCreatedResponse({ type: InvitationsResponseDto })
  @ApiBadRequestResponse({ description: INVITATIONS_SWAGGER.INVALID_CONTACT_LIST_IDS })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: INVITATIONS_SWAGGER.SESSION_OR_CONTACT_LIST_NOT_FOUND })
  @ApiConflictResponse({ description: INVITATIONS_SWAGGER.CONFLICT })
  @ApiUnprocessableEntityResponse({ description: CONTACT_LIST_EMPTY_MESSAGE })
  async createContactListInvitations(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
    @Param(CONTACT_LIST_ID_PARAM, ParseUuidPipe) contactListId: UUID,
  ): Promise<InvitationsResponseDto> {
    return await this.invitationsService.createContactListInvitations(session, contactListId, user);
  }

  @Protect()
  @Post(SESSION_PARTICIPANT_LINK_ROUTE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: INVITATIONS_SWAGGER.REGENERATE_LINK })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiParam({ name: PARTICIPANT_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: InvitedParticipantResponseDto })
  @ApiBadRequestResponse({ description: INVITATIONS_SWAGGER.INVALID_IDS })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: INVITATIONS_SWAGGER.PARTICIPANT_NOT_FOUND })
  async regenerateParticipantLink(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
    @Param(PARTICIPANT_ID_PARAM, ParseParticipantPipe) participant: Selectable<SessionMember>,
  ): Promise<InvitedParticipantResponseDto> {
    return await this.invitationsService.regenerateParticipantLink(session, participant, user);
  }

  @Protect()
  @Delete(SESSION_PARTICIPANT_LINK_ROUTE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: INVITATIONS_SWAGGER.REVOKE_LINK })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiParam({ name: PARTICIPANT_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse({ description: INVITATIONS_SWAGGER.LINK_REVOKED })
  @ApiBadRequestResponse({ description: INVITATIONS_SWAGGER.INVALID_IDS })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: INVITATIONS_SWAGGER.PARTICIPANT_NOT_FOUND })
  async revokeParticipantLink(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
    @Param(PARTICIPANT_ID_PARAM, ParseParticipantPipe) participant: Selectable<SessionMember>,
  ): Promise<void> {
    await this.invitationsService.revokeParticipantLink(session, participant, user);
  }
}
