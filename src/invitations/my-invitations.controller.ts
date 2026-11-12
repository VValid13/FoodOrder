import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectedUser } from '../_utils/decorators/connected-user-decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import type { UserEntity } from '../users/users.entity.js';
import {
  INVITATIONS_SWAGGER,
  INVITATIONS_TAG,
  MY_INVITATIONS_ROUTE,
} from './_utils/constants/invitations.constants.js';
import { UserInvitationResponseDto } from './_utils/dtos/responses/user-invitation.response.dto.js';
import { InvitationsService } from './invitations.service.js';

@ApiTags(INVITATIONS_TAG)
@Controller(MY_INVITATIONS_ROUTE)
export class MyInvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Protect()
  @Get()
  @ApiOperation({ summary: INVITATIONS_SWAGGER.FIND_MY_INVITATIONS })
  @ApiOkResponse({ type: [UserInvitationResponseDto] })
  async findUserInvitations(
    @ConnectedUser() user: UserEntity,
  ): Promise<UserInvitationResponseDto[]> {
    return await this.invitationsService.findUserInvitations(user);
  }
}
