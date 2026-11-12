import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectedUser } from '../_utils/decorators/connected-user-decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import type { UserEntity } from '../users/users.entity.js';
import {
  INVITATIONS_SWAGGER,
  INVITATIONS_TAG,
  LINK_ACCOUNT_ROUTE,
  MY_INVITATION_ROUTE,
} from './_utils/constants/invitations.constants.js';
import { CurrentParticipant } from './_utils/decorators/current-participant.decorator.js';
import { ProtectInvitation } from './_utils/decorators/protect-invitation.decorator.js';
import { MyInvitationResponseDto } from './_utils/dtos/responses/my-invitation.response.dto.js';
import { ParticipantResponseDto } from './_utils/dtos/responses/participant.response.dto.js';
import { PARTICIPANT_ALREADY_LINKED_MESSAGE } from './_utils/exceptions/invitations.exceptions.js';
import type { ParticipantContext } from './_utils/types/participant-context.type.js';
import { InvitationsService } from './invitations.service.js';

@ApiTags(INVITATIONS_TAG)
@Controller(MY_INVITATION_ROUTE)
export class MyInvitationController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @ProtectInvitation()
  @Get()
  @ApiOperation({ summary: INVITATIONS_SWAGGER.FIND_MY_INVITATION })
  @ApiOkResponse({ type: MyInvitationResponseDto })
  async findMyInvitation(
    @CurrentParticipant() participantContext: ParticipantContext,
  ): Promise<MyInvitationResponseDto> {
    return await this.invitationsService.findMyInvitation(participantContext);
  }

  @Protect()
  @ProtectInvitation()
  @Post(LINK_ACCOUNT_ROUTE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: INVITATIONS_SWAGGER.LINK_ACCOUNT })
  @ApiOkResponse({ type: ParticipantResponseDto })
  @ApiConflictResponse({ description: PARTICIPANT_ALREADY_LINKED_MESSAGE })
  async linkParticipantAccount(
    @ConnectedUser() user: UserEntity,
    @CurrentParticipant() participantContext: ParticipantContext,
  ): Promise<ParticipantResponseDto> {
    return await this.invitationsService.linkParticipantAccount(participantContext, user);
  }
}
