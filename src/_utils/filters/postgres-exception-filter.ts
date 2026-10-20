import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { ERROR_KEYS } from '../constants/error-code.constants.js';
import { Response } from 'express';
import {
  DatabaseUnavailableException,
  EntityNotFoundException,
  ForeignKeyException,
  conflictException,
  UUIDFormatException,
} from '../global.exception.js';
import { NoResultError } from 'kysely';
import { KyselyError } from '../kysely.error.js';

@Catch()
export class PostgresExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): unknown {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception && typeof exception.code === 'string' && exception.code.length === 5) {
      const httpException = this.toHttpException(exception);
      response.status(httpException.getStatus()).json({
        statusCode: httpException.errorCode,
        code: exception.code,
        message: httpException.getResponse(),
      });
    } else if (exception instanceof NoResultError) {
      const status = HttpStatus.NOT_FOUND;
      return response.status(status).json({
        statusCode: status,
        code: ERROR_KEYS.NO_RESULT_ERROR,
        message: exception.message || 'No Result exception',
      });
    } else {
      const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      return response.status(status).json({
        statusCode: status,
        code: exception.code || '500',
        message: exception.message || 'Internal server error',
      });
    }
  }

  private toHttpException(exception: DatabaseError | KyselyError): HttpException {
    switch (exception.code) {
      case ERROR_KEYS.DATABASE_UNAVAILABLE:
        return DatabaseUnavailableException;
      case ERROR_KEYS.UNIQUE_VIOLATION:
        return conflictException;
      case ERROR_KEYS.FOREIGN_KEY_VIOLATION:
        return ForeignKeyException;
      case ERROR_KEYS.UUID_FORMAT_VIOLATION:
        return UUIDFormatException;
      case ERROR_KEYS.NO_RESULT_ERROR:
        return EntityNotFoundException;
      default:
        return new InternalServerErrorException(exception.message);
    }
  }
}
