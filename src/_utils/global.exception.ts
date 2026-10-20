import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export const DatabaseUnavailableException = new BadGatewayException('Database Unavailable');
export const UUIDFormatException = new BadRequestException('Given id format is invalid.');
export const EntityNotFoundException = new NotFoundException('Requested entity not found.');
export const ForbiddenActionException = new BadRequestException('Forbidden.');
export const conflictException = new ConflictException('Username already taken.');
export const ForeignKeyException = new ConflictException('ForeignKey is invalid.');
