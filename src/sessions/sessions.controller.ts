import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { Selectable } from 'kysely';
import { ConnectedUser } from '../_utils/decorators/connected-user-decorator.js';
import { getEntityByIdPipe } from '../_utils/pipes/get-entity-by-id.pipe.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import type { Session } from '../database/database.types.js';
import type { UserEntity } from '../users/users.entity.js';
import {
  SESSION_CLOSE_ROUTE,
  SESSION_ID_PARAM,
  SESSION_ID_ROUTE,
  SESSION_MARK_ORDERED_ROUTE,
  SESSION_OPEN_ROUTE,
  SESSION_REOPEN_ROUTE,
  SESSIONS_ROUTE,
  SESSIONS_SWAGGER,
  SESSIONS_TAG,
} from './_utils/constants/sessions.constants.js';
import { CreateSessionDto } from './_utils/dtos/requests/create-session.dto.js';
import { FindSessionsDto } from './_utils/dtos/requests/find-sessions.dto.js';
import { ReopenSessionDto } from './_utils/dtos/requests/reopen-session.dto.js';
import { UpdateSessionDto } from './_utils/dtos/requests/update-session.dto.js';
import { SessionResponseDto } from './_utils/dtos/responses/session.response.dto.js';
import {
  INVALID_TRANSITION_MESSAGE,
  RESTAURANT_CLOSED_MESSAGE,
  SESSION_ALREADY_ORDERED_MESSAGE,
  SESSION_EMPTY_MENU_MESSAGE,
} from './_utils/exceptions/sessions.exceptions.js';
import { SessionsService } from './sessions.service.js';

const ParseSessionPipe = getEntityByIdPipe('session');

@ApiTags(SESSIONS_TAG)
@Controller(SESSIONS_ROUTE)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Protect()
  @Post()
  @ApiOperation({ summary: SESSIONS_SWAGGER.CREATE })
  @ApiCreatedResponse({ type: SessionResponseDto })
  @ApiBadRequestResponse({ description: SESSIONS_SWAGGER.INVALID_SCHEDULE })
  @ApiNotFoundResponse({ description: SESSIONS_SWAGGER.RESTAURANT_NOT_FOUND })
  @ApiUnprocessableEntityResponse({ description: RESTAURANT_CLOSED_MESSAGE })
  async createSession(
    @ConnectedUser() user: UserEntity,
    @Body() createSessionDto: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    return await this.sessionsService.createSession(createSessionDto, user.id);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: SESSIONS_SWAGGER.FIND_ALL })
  @ApiOkResponse({ type: [SessionResponseDto] })
  @ApiBadRequestResponse({ description: SESSIONS_SWAGGER.INVALID_QUERY })
  async findAllSessions(
    @ConnectedUser() user: UserEntity,
    @Query() findSessionsDto: FindSessionsDto,
  ): Promise<SessionResponseDto[]> {
    return await this.sessionsService.findAllSessions(user, findSessionsDto);
  }

  @Protect()
  @Get(SESSION_ID_ROUTE)
  @ApiOperation({ summary: SESSIONS_SWAGGER.FIND_ONE })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: SessionResponseDto })
  @ApiBadRequestResponse({ description: SESSIONS_SWAGGER.INVALID_ID })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: SESSIONS_SWAGGER.SESSION_NOT_FOUND })
  findSession(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
  ): SessionResponseDto {
    return this.sessionsService.findSession(session, user);
  }

  @Protect()
  @Patch(SESSION_ID_ROUTE)
  @ApiOperation({ summary: SESSIONS_SWAGGER.UPDATE })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: SessionResponseDto })
  @ApiBadRequestResponse({ description: SESSIONS_SWAGGER.INVALID_ID_OR_BODY })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: SESSIONS_SWAGGER.SESSION_NOT_FOUND })
  @ApiConflictResponse({ description: SESSION_ALREADY_ORDERED_MESSAGE })
  @ApiUnprocessableEntityResponse({ description: RESTAURANT_CLOSED_MESSAGE })
  async updateSession(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
    @Body() updateSessionDto: UpdateSessionDto,
  ): Promise<SessionResponseDto> {
    return await this.sessionsService.updateSession(session, updateSessionDto, user);
  }

  @Protect()
  @Post(SESSION_OPEN_ROUTE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: SESSIONS_SWAGGER.OPEN })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: SessionResponseDto })
  @ApiBadRequestResponse({ description: SESSIONS_SWAGGER.INVALID_OPEN })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: SESSIONS_SWAGGER.SESSION_NOT_FOUND })
  @ApiConflictResponse({ description: INVALID_TRANSITION_MESSAGE })
  @ApiUnprocessableEntityResponse({ description: SESSION_EMPTY_MENU_MESSAGE })
  async openSession(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
  ): Promise<SessionResponseDto> {
    return await this.sessionsService.openSession(session, user);
  }

  @Protect()
  @Post(SESSION_CLOSE_ROUTE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: SESSIONS_SWAGGER.CLOSE })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: SessionResponseDto })
  @ApiBadRequestResponse({ description: SESSIONS_SWAGGER.INVALID_ID })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: SESSIONS_SWAGGER.SESSION_NOT_FOUND })
  @ApiConflictResponse({ description: INVALID_TRANSITION_MESSAGE })
  async closeSession(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
  ): Promise<SessionResponseDto> {
    return await this.sessionsService.closeSession(session, user);
  }

  @Protect()
  @Post(SESSION_REOPEN_ROUTE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: SESSIONS_SWAGGER.REOPEN })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: SessionResponseDto })
  @ApiBadRequestResponse({ description: SESSIONS_SWAGGER.INVALID_REOPEN })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: SESSIONS_SWAGGER.SESSION_NOT_FOUND })
  @ApiConflictResponse({ description: INVALID_TRANSITION_MESSAGE })
  @ApiUnprocessableEntityResponse({ description: RESTAURANT_CLOSED_MESSAGE })
  async reopenSession(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
    @Body() reopenSessionDto: ReopenSessionDto,
  ): Promise<SessionResponseDto> {
    return await this.sessionsService.reopenSession(session, reopenSessionDto, user);
  }

  @Protect()
  @Post(SESSION_MARK_ORDERED_ROUTE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: SESSIONS_SWAGGER.MARK_ORDERED })
  @ApiParam({ name: SESSION_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: SessionResponseDto })
  @ApiBadRequestResponse({ description: SESSIONS_SWAGGER.INVALID_ID })
  @ApiForbiddenResponse({ description: SESSIONS_SWAGGER.NOT_OWNER })
  @ApiNotFoundResponse({ description: SESSIONS_SWAGGER.SESSION_NOT_FOUND })
  @ApiConflictResponse({ description: INVALID_TRANSITION_MESSAGE })
  async markSessionOrdered(
    @ConnectedUser() user: UserEntity,
    @Param(SESSION_ID_PARAM, ParseSessionPipe) session: Selectable<Session>,
  ): Promise<SessionResponseDto> {
    return await this.sessionsService.markSessionOrdered(session, user);
  }
}
