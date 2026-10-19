import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    InternalServerErrorException,
} from "@nestjs/common";
import {DatabaseError} from "pg";
import {ERROR_KEYS} from "../constants/error-code.constants.js";
import {Response } from "express";
import {
    DatabaseUnavailableException,
    EntityNotFoundException,
    ForeignKeyException,
    UsernameUnavailableExceptions, UUIDFormatException
} from "../.exception.js";
export class KyselyError {
    constructor(code: string, message: string) {
        this.code = code
        this.message = message
    }
    code: string;
    message: string ;
}
@Catch(DatabaseError, KyselyError)
export class PostgresExeptionFilter implements ExceptionFilter{
    catch(exception: DatabaseError | KyselyError, host: ArgumentsHost): any {
        const response = host.switchToHttp().getResponse<Response>();
        const httpException = this.toHttpException(exception);
        response
            .status(httpException.getStatus())
            .json({
                statusCode: httpException.errorCode,
                code: exception.code,
                message: httpException.getResponse()
            });
    }

    private toHttpException(exception: DatabaseError | KyselyError){
        switch (exception.code) {
                case ERROR_KEYS.DATABASE_UNAVAILABLE:
                    return DatabaseUnavailableException;
                case ERROR_KEYS.UNIQUE_VIOLATION:
                    return UsernameUnavailableExceptions;
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

