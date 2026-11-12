import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  INVITATIONS_SWAGGER,
  INVITATIONS_TAG,
  PUBLIC_LINK_JOIN_ROUTE,
  SHARE_TOKEN_PARAM,
  PUBLIC_LINKS_ROUTE,
} from './_utils/constants/invitations.constants.js';
import { JoinPublicLinkDto } from './_utils/dtos/requests/join-public-link.dto.js';
import { InvitedParticipantResponseDto } from './_utils/dtos/responses/invited-participant.response.dto.js';
import { PUBLIC_LINK_NOT_FOUND_MESSAGE } from './_utils/exceptions/invitations.exceptions.js';
import { InvitationsService } from './invitations.service.js';

@ApiTags(INVITATIONS_TAG)
@Controller(PUBLIC_LINKS_ROUTE)
export class PublicLinksController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post(PUBLIC_LINK_JOIN_ROUTE)
  @ApiOperation({ summary: INVITATIONS_SWAGGER.JOIN_PUBLIC_LINK })
  @ApiParam({ name: SHARE_TOKEN_PARAM })
  @ApiCreatedResponse({ type: InvitedParticipantResponseDto })
  @ApiBadRequestResponse({ description: INVITATIONS_SWAGGER.INVALID_BODY })
  @ApiNotFoundResponse({ description: PUBLIC_LINK_NOT_FOUND_MESSAGE })
  @ApiConflictResponse({ description: INVITATIONS_SWAGGER.JOIN_CONFLICT })
  async joinPublicLink(
    @Param(SHARE_TOKEN_PARAM) shareToken: string,
    @Body() joinPublicLinkDto: JoinPublicLinkDto,
  ): Promise<InvitedParticipantResponseDto> {
    return await this.invitationsService.joinPublicLink(shareToken, joinPublicLinkDto);
  }
}
