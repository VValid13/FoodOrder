import {
    ArgumentsHost,
    Catch,
    ExceptionFilter, HttpException, HttpStatus,
    InternalServerErrorException,
} from "@nestjs/common";
import {DatabaseError} from "pg";
import {ERROR_KEYS} from "../constants/error-code.constants.js";
import {Response } from "express";
import {
    DatabaseUnavailableException,
    EntityNotFoundException,
    ForeignKeyException,
    conflictException, UUIDFormatException
} from "../.exception.js";
import {NoResultError} from "kysely";
export class KyselyError extends Error{
    constructor(code: string, message: string) {
        super();
        this.code = code
        this.message = message
    }
    code: string;
    message: string ;
}
@Catch()
export class PostgresExeptionFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost): unknown {
        if(exception && typeof exception.code === 'string' && exception.code.length === 5){
            const httpException = this.toHttpException(exception);
            const response = host.switchToHttp().getResponse<Response>();
            response
                .status(httpException.getStatus())
                .json({
                    statusCode: httpException.errorCode,
                    code: exception.code,
                    message: httpException.getResponse()
                });
        }
        else if(exception instanceof NoResultError){
            const status = HttpStatus.NOT_FOUND;
            const response = host.switchToHttp().getResponse<Response>();
            return response.status(status).json({
                statusCode: status,
                code: '404',
                message: exception.message || 'No Result exception',
            });
        }
        else{
            const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
            const response = host.switchToHttp().getResponse<Response>();
            return response.status(status).json({
                statusCode: status,
                code: exception.code || '02000',
                message: exception.message || 'Internal server error',
            });
        }
    }

    private toHttpException(exception: DatabaseError | KyselyError): HttpException{
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

