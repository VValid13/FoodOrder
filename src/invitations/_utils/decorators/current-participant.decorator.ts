import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { ParticipantContext } from '../types/participant-context.type.js';

export const CurrentParticipant = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ParticipantContext =>
    ctx.switchToHttp().getRequest<Request & { participantContext: ParticipantContext }>()
      .participantContext,
);
