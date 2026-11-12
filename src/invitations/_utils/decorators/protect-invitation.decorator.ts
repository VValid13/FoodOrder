import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  INVITATION_TOKEN_HEADER,
  INVITATIONS_SWAGGER,
} from '../constants/invitations.constants.js';
import { INVALID_INVITATION_LINK_MESSAGE } from '../exceptions/invitations.exceptions.js';
import { InvitationGuard } from '../guards/invitation.guard.js';

export function ProtectInvitation(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    UseGuards(InvitationGuard),
    ApiHeader({
      name: INVITATION_TOKEN_HEADER,
      description: INVITATIONS_SWAGGER.INVITATION_TOKEN,
      required: true,
    }),
    ApiUnauthorizedResponse({ description: INVALID_INVITATION_LINK_MESSAGE }),
  );
}
